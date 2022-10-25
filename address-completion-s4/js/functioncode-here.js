const {
  businessPartnerService,
} = require("@sap/cloud-sdk-vdm-business-partner-service");
const { businessPartnerApi, businessPartnerAddressApi, batch, changeset } =
  businessPartnerService();
const axios = require("axios");
const getCountryISO2 = require("country-iso-3-to-2");

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
      const key = eventData.data["BusinessPartner"];
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
        businessPartnerAddressApi.schema.HOUSE_NUMBER,
        businessPartnerAddressApi.schema.REGION
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

async function completeAddress(searchtext) {
  const res = await axios.get(process.env.HERE_APU_URL, {
    params: { q: searchtext, apiKey: process.env.HERE_API_KEY },
  });

  return {
    cityName: res.data.items[0].address.city,
    postalCode: res.data.items[0].address.postalCode,
    houseNumber: res.data.items[0].address.houseNumber,
    streetName: res.data.items[0].address.street,
    country: getCountryISO2(res.data.items[0].address.countryCode),
    region: res.data.items[0].address.stateCode,
  };
}
