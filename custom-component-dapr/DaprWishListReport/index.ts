import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { DaprClient } from "dapr-client"
import { KeyValueType } from "dapr-client/types/KeyValue.type"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const daprHost = process.env.HOST_OF_DAPR
    const daprPort = process.env.DAPR_HTTP_PORT
    const stateStoreName = process.env.STATE_STORE_ID
    const stateStoreKey = context.bindingData.key

    let responseBody: string = ""
    let responseStatusCode: number = 200

    try {

        const daprClient = new DaprClient(daprHost, daprPort)

        const currentWishListEntries = <KeyValueType>await daprClient.state.get(stateStoreName, stateStoreKey)

        context.log(`Current state: ${currentWishListEntries}`)

        if (currentWishListEntries) {

            responseBody = `You have already ${currentWishListEntries.wishCounter} on your list. Your wishes are: ${currentWishListEntries.wishListItems}`

        }
        else {

            responseBody = "No wishes yet made. Go start filling you list but be aware that you only have 3 wishes"

        }

    } catch (error) {

        context.log.error(error)
        responseStatusCode = 500
        responseBody = `An error occurred when fetching the data`

    }

    context.res = {
        status: responseStatusCode,
        body: responseBody
    }

}

export default httpTrigger