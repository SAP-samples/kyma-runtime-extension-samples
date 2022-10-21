const { ClientCredentials } = require("simple-oauth2");
const axios = require("axios");

const dqsUAA = JSON.parse(process.env.DQS_UAA);
const baseURL = process.env.CENTRAL_GW_URL;
const dqsUrl = "https://" + process.env.URI + "/dq/addressCleanse";

console.log(`Base URL = ${baseURL}`);
console.log(`dqs url: ${dqsUrl}`);

const config = {
  client: {
    id: dqsUAA.clientid,
    secret: dqsUAA.clientsecret,
  },
  auth: {
    tokenHost: `${dqsUAA.url}/oauth/token`,
  },
  options: {
    credentialsEncodingMode: "loose",
  },
};

// the function (module)
module.exports = {
  main: async function (event, context) {
    var accountId = event.data["entity-id"];

    console.log(`Account ID from Event: ${accountId}`);
    try {
      // read address
      const response = await axios({
        method: "get",
        url: `${baseURL}/CorporateAccountCollection('${accountId}')`,
        params: {
          $select:
            "CurrentDefaultAddressUUID,CountryCode,CountryCodeText,City,StateCodeText,StreetPostalCode,Street,HouseNumber",
        },
      });
      const corporateAccount = response.data.d.results;
      const addressId = corporateAccount.CurrentDefaultAddressUUID.replace(
        /-/g,
        ""
      );
      console.log(`Corporate Account response: ${JSON.stringify(corporateAccount)}`);

      var addressObj = createAddressObj(corporateAccount);

      console.log("Address Object:");
      console.log(addressObj);

      const result = await addressCleanse(addressObj);
      var correctedAddress = formatAddressForC4C(result);

      console.log(`corrected address ${JSON.stringify(correctedAddress)}`);

      // update c4c
      if (isAddressCorrected(correctedAddress, corporateAccount)) {
        console.log("corrections necessary");
        correctedAddress.ObjectID = addressId;
        console.log(correctedAddress);

        var updateResponse = await axios({
          method: "patch",
          url: `${baseURL}/CorporateAccountAddressCollection('${addressId}')`,
          data: correctedAddress,
        });
        //console.log(updateResponse)
        console.log("Address successfully updated");
      } else {
        console.log("no corrections necessary");
      }

      event.extensions.response.status(200).send();
    } catch (error) {
      console.log("Error:");
      console.log(error);
      event.extensions.response.status(500).send("Error");
    }
  },
};

function formatAddressForC4C(cleansedAddress) {
  var addressC4C = {};
  addressC4C.CountryCode = cleansedAddress.std_addr_country_2char;
  addressC4C.City = cleansedAddress.std_addr_locality_full;
  addressC4C.StateCodeText = cleansedAddress.std_addr_region_full;
  addressC4C.StreetPostalCode = cleansedAddress.std_addr_postcode_full;
  addressC4C.Street = cleansedAddress.std_addr_prim_name_full;
  addressC4C.HouseNumber = cleansedAddress.std_addr_prim_number_full;

  return addressC4C;
}

function createAddressObj(addressObj) {
  var addressInput = {};
  addressInput.country = addressObj.CountryCode;
  addressInput.locality = addressObj.City;
  addressInput.region = addressObj.StateCodeText;
  addressInput.postcode = addressObj.StreetPostalCode;
  addressInput.mixed = addressObj.HouseNumber + " " + addressObj.Street;



  var outputFields = [
    "std_addr_address_delivery",
    "std_addr_prim_name_full",
    "std_addr_prim_number_full",
    "std_addr_locality_full",
    "std_addr_region_full",
    "std_addr_postcode_full",
    "std_addr_country_2char",
  ];

  return { addressInput: addressInput, outputFields: outputFields };
}

async function addressCleanse(addressObj) {
  try {
    const auth = await getOAuthToken();

    var result = await axios.post(dqsUrl, addressObj, {
      headers: {
        Authorization: auth.token.token_type + " " + auth.token.access_token,
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    console.log("an error occurred: ", error);
    return error;
  }
}

async function getOAuthToken() {
  var resp = "";
  const client = new ClientCredentials(config);

  try {
    resp = await client.getToken({});
  } catch (error) {
    throw new Error(error);
  }

  return resp;
}

function isAddressCorrected(correctedAddress, corporateAccount) {
  for (var key in correctedAddress) {
    if (key !== 'StateCodeText' && correctedAddress[key] !== corporateAccount[key]) {
      return true;
    }
  }
  return false;
}
