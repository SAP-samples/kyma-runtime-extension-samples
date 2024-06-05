module.exports = createSalesCloudCase

const salesCloudGatewayUrl = process.env['SALES_CLOUD_V2_GATEWAY_URL'];
const user = process.env['SALES_CLOUD_V2_USER'];
const password = process.env['SALES_CLOUD_V2_PASSWORD'];

const customerAccountAPIPath = '/account-service/accounts';
const notesAPIPath = '/note-service/notes';
const caseAPIPath = '/case-service/cases';
const axios = require('axios');

async function createSalesCloudCase(customerEmail, comment) {
    const salesCouldAccount = await getSalesCloudAccount(customerEmail);
    if (salesCouldAccount) {
        const salesCloudCase = await createCase(salesCouldAccount, customerEmail, comment);
        console.log(salesCloudCase);
    }
}

async function createCase(salesCouldAccount, customerEmail, comment) {
    const note = await createNoteForCase(comment);
    return await createCaseUsingNote(salesCouldAccount, customerEmail, note);
}

async function createCaseUsingNote(salesCouldAccount, customerEmail,note) {
    const url = `${salesCloudGatewayUrl}${caseAPIPath}`;
    const response = await axios.request({
        url: url,
        method: 'post',
        data: {
            priority: "02",
            subject: "Negative product review from " + customerEmail,
            caseType: "ZJH2",
            account: {
                id: salesCouldAccount.id
            },
            description: {
                noteId: note.id,
                content: note.plainContent
            }
        },
        auth: {
            username: user,
            password: password
        }
    });
    return response.data.value;
}

async function createNoteForCase(comment) {
    const url = `${salesCloudGatewayUrl}${notesAPIPath}`;
    const response = await axios.request({
        url: url,
        method: 'post',
        data: {
            noteTypeCode: 'S001',
            htmlContent: `<p>${comment}</p>`,
        },
        auth: {
            username: user,
            password: password
        }
    });
    return response.data.value;
}

async function getSalesCloudAccount(email) {
    const url = `${salesCloudGatewayUrl}${customerAccountAPIPath}`;
    const response = await axios.request({
        url: url,
        params: {
            $filter: `(defaultCommunication/eMail eq \'${email}\')`
        },
        method: 'get',
        auth: {
            username: user,
            password: password
        }
    });
    if (response.data.value.length === 0) {
        return null;
    }
    return response.data.value[0];
}