import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const orderList = [{ "orderId": 10000001 }, { "orderId": 10000002 }, { "orderId": 10000003 }];

    context.log(`Fetching orders for material ${context.bindingData.materialid}`)

    const randomOrderEntry = orderList[getRandomInt(0, orderList.length - 1)]

    context.log(`The order ${context.req.body.userId}-${randomOrderEntry.orderId} belongs to the material ${context.bindingData.materialid}`)

    const responseBody = {
        "materialId": context.bindingData.materialid,
        "orderId": `${context.req.body.userId}-${randomOrderEntry.orderId}`
    }

    context.res = {
        body: responseBody
    }

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default httpTrigger