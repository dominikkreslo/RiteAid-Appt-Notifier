const fetch = require("node-fetch");
const sendEmail = require("./email.js");
const sleepTime = 20 * 1000;
const zipCode = "08755"; // must be string to maintain leading zeros
const searchRadius = "50"; // in miles
const terminalLink = require("terminal-link");

const link = terminalLink(
  "Rite Aid Appointment Website",
  "https://www.riteaid.com/pharmacy/covid-qualifier"
);

fetch(
  `https://www.riteaid.com/services/ext/v2/stores/getStores?address=${zipCode}&attrFilter=PREF-112&fetchMechanismVersion=2&radius=${searchRadius}`
)
  .then((res) => res.json())
  .then((res) => {
    getAvailability(res.Data.stores);
  });

function getAvailability(stores) {
  const today = new Date();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  console.log("\x1b[1m", "Grabbing availability", "\x1b[0m", time);
  console.log(link);
  let promises = [];
  for (const store of stores) {
    promises.push(
      fetch(
        `https://www.riteaid.com/services/ext/v2/vaccine/checkSlots?storeNumber=${store.storeNumber}`
      ).then((res) => res.json())
    );
  }

  Promise.all(promises)
    .then((res) => {
      let available = [];

      res.map((res, index) => {
        const returnData = res.Data;
        const locationString = `${stores[index].address}, ${stores[index].city}`;
        if (returnData.slots["1"] || returnData.slots["2"]) {
          console.log(locationString, "\x1b[32m", "AVAILABLE", "\x1b[0m");

          available.push(locationString);
        } else {
          console.log(locationString, "\x1b[31m", "NOT AVAILABLE", "\x1b[0m");
        }
      });

      if (available.length > 0) {
        //sendEmail(available);
      }
      return;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setTimeout(() => {
        getAvailability(stores);
      }, sleepTime);
    });
}
