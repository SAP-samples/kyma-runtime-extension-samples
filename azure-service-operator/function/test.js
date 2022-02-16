const handler = require('./handler.js');
const postReq = {
    data: {
        id: '1',
        description: 'test'
    },
    extensions: {
        request: {
            method: 'POST'
        }
    }
};

const getReq = {
    extensions: {
        request: {
            method: 'GET',
            url: 'https://x.y.com/1'
        }
    }
}

async function test() {

    if (process.env.OP === 'GET') {
        const entry = await handler.main(getReq, {});
        console.log(entry);
    } else {
        await handler.main(postReq, {});
    }
    process.exit();
}

test();