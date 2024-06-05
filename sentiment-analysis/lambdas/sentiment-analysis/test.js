const saleCloudV2Service = require('./sales-cloud-v2');

async function test(){
    await saleCloudV2Service.main({},{});
    process.exit();
}

test();