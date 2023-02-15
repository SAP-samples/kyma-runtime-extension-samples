const {
  businessPartnerService,
} = require("@sap/cloud-sdk-vdm-business-partner-service");
const { businessPartnerApi, businessPartnerAddressApi, batch, changeset } =
  businessPartnerService();
const { ClientCredentials } = require("simple-oauth2");
const axios = require("axios");

const destConfig = {
  url: process.env.s4URL,
  authentication: process.env.s4Authentication,
  username: process.env.s4User,
  password: process.env.s4Password,
};

const dqs_uaa_params = JSON.parse(process.env.dqsuaa);
const config = {
  client: {
    id: dqs_uaa_params.clientid,
    secret: dqs_uaa_params.clientsecret,
  },
  auth: {
    tokenHost: dqs_uaa_params.url,
  },
  options: {
    credentialsEncodingMode: "loose",
  },
};

module.exports = {
  main: async function (event, context) {
    try {
      const eventData = getEventData(event.data);
      const key = eventData["BusinessPartner"];
      console.log("received data for BusinessPartner: ", key);
      const response = await getBPAddress(key);

      var bpAddress,
        addressCorResult,
        addressResult,
        addressObj,
        addressCorS4Formatted,
        resultsArr = [];
      for (let i = 0; i < response.toBusinessPartnerAddress.length; i++) {
        bpAddress = response.toBusinessPartnerAddress[i];

        addressObj = createAddressObj(bpAddress);
        addressCorResult = await addressCleanse(addressObj);
        addressCorS4Formatted = formatAddressForS4(addressCorResult);

        if (isAddressCorrected(addressCorS4Formatted, bpAddress)) {
          addressResult = businessPartnerAddressApi
            .entityBuilder()
            .fromJson(addressCorS4Formatted);
          addressResult.addressId =
            response.toBusinessPartnerAddress[i].addressId;
          addressResult.businessPartner =
            response.toBusinessPartnerAddress[i].businessPartner;
          resultsArr.push(addressResult);
        }
      }

      if (resultsArr.length > 0) {
        return await updateBPAddress(resultsArr);
      } else {
        const msg =
          "No corrections were necessary for the BusinessPartner addresses..";
        console.log(msg);
        event.extensions.response.status(200).json({ message: msg });
      }
    } catch (err) {
      console.log("An error occured...");
      console.log(err);
      event.extensions.response
        .status(200)
        .json({ message: err.message, error: err });
    }
  },
};

function getEventData(data) {
  var dataObj;
  try {
    dataObj = JSON.parse(data);
  } catch (err) {
    dataObj = data;
  }
  return dataObj;
}

async function getBPAddress(key) {
  console.log("Getting BusinessPartner: ", key);

  return businessPartnerApi
    .requestBuilder()
    .getByKey(key)
    .select(
      businessPartnerApi.schema.BUSINESS_PARTNER,
      businessPartnerApi.schema.TO_BUSINESS_PARTNER_ADDRESS.select(
        businessPartnerApi.schema.BUSINESS_PARTNER,
        businessPartnerAddressApi.schema.ADDRESS_ID,
        businessPartnerAddressApi.schema.COUNTRY,
        businessPartnerAddressApi.schema.POSTAL_CODE,
        businessPartnerAddressApi.schema.CITY_NAME,
        businessPartnerAddressApi.schema.STREET_NAME,
        businessPartnerAddressApi.schema.HOUSE_NUMBER,
        businessPartnerAddressApi.schema.REGION
      )
    )
    .execute(destConfig);
}

function createAddressObj(addressObj) {
  var addressInput = {};

  addressInput.locality = addressObj.cityName;
  addressInput.postcode = addressObj.postalCode;
  addressInput.region = addressObj.region;
  addressInput.mixed = addressObj.houseNumber + " " + addressObj.streetName;
  addressInput.country = addressObj.country;

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
  const url = "https://" + process.env.dqsuri + "/dq/addressCleanse";

  try {
    const auth = await getOAuthToken();

    var result = await axios.post(url, addressObj, {
      headers: {
        Authorization: auth.token.token_type + " " + auth.token.access_token,
        "Content-Type": "application/json",
      },
    });
    return result.data;
  } catch (error) {
    console.log("An error occurred - addressCleanse");
    return error;
  }
}

function formatAddressForS4(correctedAdd) {
  var addressObj = {};
  addressObj.cityName = correctedAdd.std_addr_locality_full;
  addressObj.region = correctedAdd.std_addr_region_full;
  addressObj.postalCode = correctedAdd.std_addr_postcode_full;
  addressObj.country = correctedAdd.std_addr_country_2char;
  addressObj.streetName = correctedAdd.std_addr_prim_name_full;
  addressObj.houseNumber = correctedAdd.std_addr_prim_number_full;
  return addressObj;
}

function isAddressCorrected(correctedAdd, address) {
  for (var key in correctedAdd) {
    if (address[key] !== correctedAdd[key]) {
      return true;
    }
  }
  return false;
}

async function updateBPAddress(addressArr) {
  console.log("Corrections necessary - updating BusinessPartner address...");
  console.log(addressArr);
  const updateRequests = addressArr.map((address) =>
    businessPartnerAddressApi.requestBuilder().update(address)
  );
  const batchResponses = await batch(changeset(...updateRequests)).execute(
    destConfig
  );

  if (batchResponses.some((response) => !response.isSuccess())) {
    console.log("An error occurred - updateBPAddress");
    batchResponses.forEach((resp) => {
      console.log(resp.body.error.message);
    });
    throw "An error occured - updateBPAddress";
  }
  return batchResponses[0];
}
function isElement(element, targetQualifier) {
  return element.types.indexOf(targetQualifier) > -1;
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
