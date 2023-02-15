const {
  businessPartnerService,
} = require("@sap/cloud-sdk-vdm-business-partner-service");
const { businessPartnerApi, businessPartnerAddressApi, batch, changeset } =
  businessPartnerService();
const { Client, Status } = require("@googlemaps/google-maps-services-js");
const googleAPIKey = process.env.googleAPIKey;
const client = new Client({});

const destConfig = {
  url: process.env.s4URL,
  authentication: process.env.s4Authentication,
  username: process.env.s4User,
  password: process.env.s4Password,
};

module.exports = {
  main: async function (event, context) {
    try {
      const eventData = getEventData(event.data);
      const key = eventData["BusinessPartner"];
      console.log("received data for BusinessPartner: ", key);
      const response = await getBPAddress(key);

      var bpAddress,
        searchtext,
        addressCorResult,
        addressResult,
        resultsArr = [];
      for (let i = 0; i < response.toBusinessPartnerAddress.length; i++) {
        bpAddress = response.toBusinessPartnerAddress[i];
        searchtext = createSearchString(bpAddress);
        addressCorResult = await completeAddress(searchtext);

        if (isAddressCorrected(addressCorResult, bpAddress)) {
          addressResult = businessPartnerAddressApi
            .entityBuilder()
            .fromJson(addressCorResult);
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
        businessPartnerAddressApi.schema.HOUSE_NUMBER
      )
    )
    .execute(destConfig);
}

function createSearchString(address) {
  var searchtext = "";
  for (var key in address) {
    if (key !== "addressId" && key !== "businessPartner") {
      // ignore addressId and businessPartner
      if (
        typeof address[key] !== "function" &&
        typeof address[key] !== "undefined"
      ) {
        searchtext += " " + address[key];
      }
    }
  }
  return searchtext;
}

async function completeAddress(searchtext) {
  console.log("validating address...");
  try {
    var resp = await client.geocode({
      params: {
        key: googleAPIKey,
        address: searchtext,
      },
      timeout: 2000,
    });
  } catch (e) {
    throw e.response.data.error_message;
  }

  if (resp.data.status !== Status.OK) {
    throw `could not geocode address, result ${resp.data.status} received`;
  }

  var response = {};
  // get address
  resp.data.results[0].address_components.forEach((element) => {
    if (isElement(element, "route")) {
      response.streetName = element.long_name;
    } else if (isElement(element, "street_number")) {
      response.houseNumber = element.long_name;
    } else if (isElement(element, "locality")) {
      response.cityName = element.long_name;
    } else if (isElement(element, "postal_code")) {
      response.postalCode = element.long_name;
    } else if (isElement(element, "country")) {
      response.country = element.short_name;
    }
  });

  return response;
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
  const updateRequests = addressArr.map((address) =>
    businessPartnerAddressApi.requestBuilder().update(address)
  );
  const batchResponses = await batch(changeset(...updateRequests)).execute(
    destConfig
  );
  return batchResponses[0];
}

function isElement(element, targetQualifier) {
  return element.types.indexOf(targetQualifier) > -1;
}
