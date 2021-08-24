const exampleTripsData = {
  AAAA: {
    id: "AAAA",
    title: "Barcelona",
    baseCurrency: "EUR",
    exchangeRates: {
      EUR: 1,
      USD: 0.8,
      CHF: 1.1,
    },
    evtExchangeRate: getCurrentTimestampSec() - 10000,
    evtCreated: getCurrentTimestampSec() - 10000,
    mates: {
      ASDASDAD: {
        id: "ASDASDAD",
        name: "Samuel",
        expenses: [
          {
            evtCreated: getCurrentTimestampSec() - 5000,
            amount: 42.1,
            currency: "EUR",
          },
          {
            evtCreated: getCurrentTimestampSec() - 3000,
            amount: 13.2,
            currency: "CHF",
          },
        ],
      },
      34524567855: {
        id: "34524567855",
        name: "Cédric",
        expenses: [
          {
            evtCreated: getCurrentTimestampSec() - 100,
            amount: 42.1,
            currency: "EUR",
          },
        ],
      },
    },
  },
  BBBB: {
    id: "BBBB",
    title: "Ibiza",
    baseCurrency: "CHF",
    exchangeRates: {
      EUR: 0.93345,
      CHF: 1.0,
    },
    evtExchangeRate: getCurrentTimestampSec() - 324234,
    evtCreated: getCurrentTimestampSec() - 324234,
    mates: {
      32341234: {
        id: "32341234",
        name: "Julian",
        expenses: [
          {
            evtCreated: getCurrentTimestampSec() - 3000,
            amount: 1,
            currency: "CHF",
          },
          {
            evtCreated: getCurrentTimestampSec() - 1000,
            amount: 1,
            currency: "EUR",
          },
        ],
      },
    },
  },
};
