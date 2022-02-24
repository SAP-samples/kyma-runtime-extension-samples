import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { DaprClient } from "dapr-client"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const daprHost = process.env.HOST_OF_DAPR
    const daprPort = process.env.DAPR_HTTP_PORT
    const stateStoreName = process.env.STATE_STORE_ID
    const stateStoreKey = context.bindingData.key

    let responseBody: string = ""
    let responseStatusCode: number = 200

    if (stateStoreKey) {

        try {

            const daprClient = new DaprClient(daprHost, daprPort)

            await daprClient.state.delete(stateStoreName, stateStoreKey)

            context.log(`Deletion succeeded for key ${stateStoreKey}`)

            responseBody = `Deleted state store for key ${stateStoreKey}`

        } catch (error) {

            context.log.error(error)
            responseStatusCode = 500
            responseBody = `An error occurred during deletion`

        }
    }

    context.res = {
        status: responseStatusCode,
        body: responseBody
    }

}


export default httpTrigger