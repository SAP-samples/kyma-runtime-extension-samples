#!/usr/bin/env node

const { spawnSync } = require('child_process');
const { basename } = require('path');

function throwError(str) {
    if (!process.env.DEBUG) {
        console.error(str);
        process.exit(1);
    } else {
        throw new Error(str);
    }
}

function cf(...args) {
    const result = spawnSync(`cf`, args, { stdio: [ 'inherit', 'pipe', 'inherit' ] });
    if (result.status !== 0) throwError `Command "cf ${args.join(' ')}" failed with return code ${result.status}`;
    return result.stdout.toString();
}

function cfGet(...args) {
    const result = cf('curl', ...args);
    return JSON.parse(result);
}

function cfGetOne(url, error) {
    const result = cfGet(url).resources;
    if (result.length !== 1) throwError(error);
    return result[0];
}

function cfTarget() {
    const result = cf('target');
    return {
        apiEndpoint: extract(result, /api endpoint\s*:\s*([^\s]+)/i, `CF API endpoint is missing. Use 'cf login' to login.`),
        user: extract(result, /user\s*:\s*(.+)/i, `CF user is missing. Use 'cf login' to login.`),
        orgName: extract(result, /org\s*:\s*(.+)/i, `CF org is missing. Use 'cf target -o <ORG> to specify.`),
        spaceName: extract(result, /space\s*:\s*(.+)/i, `CF space is missing. Use 'cf target -s <SPACE>' to specify.`),
    };
}

function extract(string, pattern, errorMsg) {
    const [_, result] = string.match(pattern) || [];
    if (!result) throwError(errorMsg);
    return result;
}

function cfSpace() {
    const target = cfTarget();

    const { orgName, spaceName } = target;
    const org = cfGetOne(`/v3/organizations?names=${ee(orgName)}`, `CF org "${orgName}" not found!`);
    const orgGuid = org.guid;
    const space = cfGetOne(`/v3/spaces?names=${ee(spaceName)}&&organization_guids=${ee(orgGuid)}`, `CF space "${spaceName}" not found!`);
    const spaceGuid = space.guid;
    return { ...target, spaceGuid, orgGuid };
}

function serviceKey(spaceGuid, instanceName, keyName) {
    const instance = cfGetOne(`/v3/service_instances?names=${ee(instanceName)}&space_guids=${ee(spaceGuid)}`, `Cannot get service instance "${instanceName}"`);
    const key = cfGetOne(`/v3/service_credential_bindings?service_instance_guids=${ee(instance.guid)}&names=${ee(keyName)}`, `Cannot get service key "${keyName}"`);
    const plan = cfGetOne(`/v3/service_plans?guids=${ee(instance.relationships.service_plan.data.guid)}`, `Cannot get service plan "${instance.relationships.service_plan.data.guid}"`);
    const offering = cfGetOne(`/v3/service_offerings?guids=${ee(plan.relationships.service_offering.data.guid)}`, `Cannot get service offering "${plan.relationships.service_offering.data.guid}"`);
    const { credentials } = cfGet(`/v3/service_credential_bindings/${e(key.guid)}/details`);
    const metadata = {tags: offering.tags, plan: plan.name, type: offering.name, label: offering.name, instance_name: instanceName, instance_guid: instance.guid};

    const credentialsS = serialize(credentials);
    const metadataS = serialize(metadata);

    return { ...metadataS.data, ...credentialsS.data, ['.metadata']: JSON.stringify({ metaDataProperties: metadataS.metadata, credentialProperties: credentialsS.metadata }, null, 2)};
}

function serialize(obj) {
    const metadata = [];
    const data = {};

    for (const name of Object.keys(obj)) {
        const value = obj[name];

        if (typeof value === "string") {
            data[name] = value;
            metadata.push({ name, format: "string"});
        } else {
            data[name] = JSON.stringify(value);
            metadata.push({name, format: "json"});
        }
    }

    return {metadata, data};
}

const e = encodeURIComponent;
const ee = s => e(e(s));

const instanceName = process.argv[2];
if (!instanceName) throwError(`Usage: node ${basename(__filename)} CF-SERVICE-INSTANCE-NAME [CF-SERVICE-KEY-NAME]`);
const { spaceGuid } = cfSpace();
const keyName = process.argv[3] || `${instanceName}-key`;
const secretData = serviceKey(spaceGuid, instanceName, keyName);
const secret = { apiVersion: "v1", kind: "Secret", type: "Opaque", metadata: { name: instanceName }, stringData: secretData };
console.log(JSON.stringify(secret, null, 2));
