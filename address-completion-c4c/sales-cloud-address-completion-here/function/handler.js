const axios = require("axios");
const getCountryISO2 = require("country-iso-3-to-2");

const hereAPIKey = process.env.HERE_API_KEY;
const hereAPIUrl = process.env.HERE_API_URL;
const baseURL = process.env.CENTRAL_GW_URL;
console.log(`Base URL = ${baseURL}`);


// the function (module)
module.exports = {
  main: async function (event, context) {
    var accountId = event.data["entity-id"];

    console.log(`Account ID from Event: ${accountId}`);
    try {
      // read address
      const readAccountResponse = await axios({
        method: "get",
        url: `${baseURL}/CorporateAccountCollection('${accountId}')`,
        params: {
          $select:
            "CurrentDefaultAddressUUID,CountryCode,CountryCodeText,City,StateCodeText,StreetPostalCode,Street,HouseNumber",
        },
      });
      const corporateAccount = readAccountResponse.data.d.results;
      const addressId = corporateAccount.CurrentDefaultAddressUUID.replace(
        /-/g,
        ""
      );
      console.log(`Corporate Account response: ${JSON.stringify(corporateAccount)}`);

      const searchText = getSearchText(corporateAccount);

      const correctedAddress = await completeAddress(searchText);
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


function getSearchText(corporateAccount) {
  var searchText = "";
  for (var key in corporateAccount) {
    if (key !== '__metadata') // filter metadata
    {
      if ((typeof corporateAccount[key] !== "function") && (typeof corporateAccount[key] !== "undefined")) {
        searchText += " " + corporateAccount[key];
      }
    }
  }

  console.log(`Input Address: ${searchText}`);
  return searchText;
}

async function completeAddress(searchText) {
  const res = await axios.get(hereAPIUrl, {
    params: { q: searchText, apiKey: hereAPIKey },
  });
  const hereAddress = res.data.items[0].address;

  var addressC4C = {};
  addressC4C.CountryCode = getCountryISO2(hereAddress.countryCode);
  addressC4C.City = hereAddress.city;
  addressC4C.StreetPostalCode = hereAddress.postalCode;
  addressC4C.Street = hereAddress.street;
  addressC4C.HouseNumber = hereAddress.houseNumber;

  return addressC4C;
}

function isAddressCorrected(correctedAddress, corporateAccount) {
  for (var key in correctedAddress) {
    if (correctedAddress[key] !== corporateAccount[key]) {
      return true;
    }
  }
  return false;
}