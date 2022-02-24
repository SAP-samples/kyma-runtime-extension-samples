import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { DaprClient } from "dapr-client"
import { KeyValuePairType } from "dapr-client/types/KeyValuePair.type"
import { KeyValueType } from "dapr-client/types/KeyValue.type"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const daprHost = process.env.HOST_OF_DAPR
    const daprPort = process.env.DAPR_HTTP_PORT
    const stateStoreName = process.env.STATE_STORE_ID
    const stateStoreKey = context.bindingData.key

    let responseBody: string = ""
    let responseStatusCode: number = 200
    let wishCounter = 0
    let wishListEntries: KeyValuePairType[] = []


    try {

        const daprClient = new DaprClient(daprHost, daprPort)

        let currentWishListEntries = <KeyValueType>await daprClient.state.get(stateStoreName, stateStoreKey)

        context.log(`Current state: ${currentWishListEntries}`)


        if (currentWishListEntries) {

            wishCounter = parseInt(currentWishListEntries.wishCounter) + 1

            context.log(`Number of wishes after adding: ${wishCounter}`)

            //Check number of wishes - if more than 3, return error
            if (wishCounter > 3) {

                context.log(`Wishcounter exceeds limit`)

                responseBody = "Sorry you already had your three wishes"

                responseStatusCode = 418

            }
            else {

                wishListEntries.push({
                    "key": stateStoreKey,
                    "value": {
                        "wishCounter": wishCounter.toString(),
                        "wishListItems": currentWishListEntries.wishListItems + ", " + req.body.wishListItem
                    }
                })

                await daprClient.state.save(stateStoreName, wishListEntries)

                responseBody = "Your wish has been successfully added"

                context.log(`Added new wish to list`)
            }

        }
        else {

            //No wish on the list, let's add the first one
            wishListEntries.push({
                "key": stateStoreKey,
                "value": {
                    "wishCounter": "1",
                    "wishListItems": req.body.wishListItem
                }
            })

            await daprClient.state.save(stateStoreName, wishListEntries)

            responseBody = `Wishlist updated with the first item: ${req.body.wishListItem}`

            context.log(`Added first wish to list`)

        }


    } catch (error) {

        context.log.error(error)
        responseStatusCode = 500
        responseBody = `An error occurred when communicating with dapr`

    }


    context.res = {
        status: responseStatusCode,
        body: responseBody
    }

}

export default httpTrigger