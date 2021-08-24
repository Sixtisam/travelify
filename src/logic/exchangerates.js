import { Toast } from "native-base";
import { createAsyncThunk } from "@reduxjs/toolkit";

// https://app.abstractapi.com/api/exchange-rates/documentation
const WEBSERVICE_BASE_URL = "https://exchange-rates.abstractapi.com/v1";
const WEBSERVICE_API_KEY = "b982bf98579448628aecca2fae96a78f";

export const fetchExchangeRates = createAsyncThunk("trips/fetchExchangeRate", async ({ baseCurrency, tripId }, thunkAPI) => {
  const to = thunkAPI.getState().config.currencies.join(",");

  try {
    const response = await fetch(`${WEBSERVICE_BASE_URL}/live?api_key=${WEBSERVICE_API_KEY}&base=${baseCurrency}&target=${to}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return {
      tripId: tripId,
      baseCurrency: baseCurrency,
      evtExchangeRate: data.last_updated,
      exchangeRates: data.exchange_rates,
    };
  } catch (e) {
    console.error(e);
    Toast.show({ title: "Could not fetch latest exchange rates" });
    return null;
  }
});
