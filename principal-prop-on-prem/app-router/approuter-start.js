const appRouter = require('@sap/approuter');
const xsenv = require('@sap/xsenv');
const qs = require('qs');
const axios = require('axios');

const xsuaaSvc = xsenv.serviceCredentials({ tag: 'xsuaa' });

const ar = appRouter();

ar.beforeRequestHandler.use('/sap/com', async function (req, res, next) {
    try {
        const accessToken = extractTokenFromReq(req);
        const exchangedToken = await doTokenExchange(createFormData(accessToken));
        req.headers['SAP-Connectivity-Authentication'] =  `Bearer ${exchangedToken}`;
        next();
    } catch (error) {
        console.log(error);
        res.end(JSON.stringify(error));
    }
});

ar.start();

function extractTokenFromReq(req) {
    const oAuthorization = JSON.parse(req._passport.session.user);
    const accessToken = oAuthorization.token.accessToken;
    console.log(`access token is ${accessToken}`);
    return accessToken;
}

function createFormData(accessToken) {
    var data = qs.stringify({
        'client_id': xsuaaSvc.clientid,
        'client_secret': xsuaaSvc.clientsecret,
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'response_type': 'token',
        'token_format': 'jwt',
        'assertion': accessToken,
    });
    console.log(`created form data ${JSON.stringify(data)}`);
    return data;
}

async function doTokenExchange(formData) {
    console.log(`form data in exchange token ${JSON.stringify(formData)}`);
    const response = await axios({
        method: 'post',
        url: `${xsuaaSvc.url}/oauth/token`,
        data: formData,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        }
    });
    const exchangedToken = response.data.access_token;
    console.log(`token exchange response: ${response.status} ${exchangedToken}`);
    return exchangedToken;
}