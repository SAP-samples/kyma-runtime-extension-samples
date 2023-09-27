const debug = require('debug')('fun-srv:function');
const xsenv = require('@sap/xsenv');
const services = xsenv.getServices({
  uaa: { label: 'xsuaa' }
  ,
  hana: { label: 'hana' }
});

const util = require('util');
const xssec = require('@sap/xssec');
const createSecurityContext = util.promisify(xssec.createSecurityContext);

const hana = require('@sap/hana-client');
services.hana.sslValidateCertificate = true;
services.hana.ssltruststore = services.hana.certificate;
const hanaConn = hana.createConnection();

async function queryDB(sql, procedure, param) {
  try {
    await hanaConn.connect(services.hana);
  } catch (err) {
    debug('queryDB connect', err.message, err.stack);
    results = err.message;
  }
  try {
    await hanaConn.exec('SET SCHEMA ' + services.hana.schema);
    if (procedure === undefined) {
      results = await hanaConn.exec(sql);
    }
    else {
      let hanaStmt = await hanaConn.prepare(procedure);
      results = hanaStmt.exec(param);
    }
  } catch (err) {
    debug('queryDB exec', err.message, err.stack);
    results = err.message;
  }
  try {
    await hanaConn.disconnect();
  } catch (err) {
    debug('queryDB disconnect', err.message, err.stack);
    results = err.message;
  }
  return results;
}

const httpClient = require('@sap-cloud-sdk/http-client');
const { retrieveJwt } = require('@sap-cloud-sdk/connectivity');
module.exports = {
  main: async function (event, context) {
    let req = event.extensions.request;

    let securityContext;
    if (typeof req.headers.authorization === 'string' && req.headers.authorization.split(' ').length > 1 && req.headers.authorization.split(' ')[0].toLowerCase() === 'bearer') {
      try {
        securityContext = await createSecurityContext(req.headers.authorization.split(' ')[1], services.uaa);
      } catch (err) {
        debug('Create Security Context', err.message);
        event.extensions.response.sendStatus(401);
        return;
      }
    } else {
      debug('Create Security Context', 'Invalid Headers - Missing Access Token');
      event.extensions.response.sendStatus(401);
      return;
    }

    switch(req.path) {
      case '/srv/':
          results = 'fun';
        break;

      case '/srv/user':
          try {
            let user = {};
            user.logonName = securityContext.getLogonName();
            user.givenName = securityContext.getGivenName();
            user.familyName = securityContext.getFamilyName();
            user.email = securityContext.getEmail();
            results = user;
          } catch (err) {
            debug('/srv/user', err.message, err.stack);
            results = err.message;
          }
        break;

      case '/srv/dest':
          try {
            let res1 = await httpClient.executeHttpRequest(
              {
                destinationName: req.query.destination || 'fun-nw'
                ,
                jwt: retrieveJwt(req)
              },
              {
                method: 'GET',
                url: req.query.path || ''
              }
            );
            results = res1.data;
          } catch (err) {
            debug('/srv/dest', err.message, err.stack);
            results = err.message;
          }
        break;

      case '/srv/sales':
          results = await queryDB(`SELECT * FROM "fun.db::sales"`);
        break;

      case '/srv/topSales':
          let amount = req.query.amount ?? 0;
          results = await queryDB('', `CALL "fun.db::SP_TopSales"(?,?)`,[amount]);
        break;

      case '/srv/session':
          results = await queryDB(`SELECT * FROM M_SESSION_CONTEXT`);
        break;

      case '/srv/db':
          results = await queryDB(`SELECT SYSTEM_ID, DATABASE_NAME, HOST, VERSION, USAGE FROM M_DATABASE`);
        break;

      case '/srv/connections':
          results = await queryDB(`SELECT TOP 10 USER_NAME, CLIENT_IP, CLIENT_HOST, START_TIME FROM M_CONNECTIONS WHERE OWN='TRUE' ORDER BY START_TIME DESC`);
        break;

      default:
        event.extensions.response.sendStatus(400);
        return;
    }

    return results;
  }
}