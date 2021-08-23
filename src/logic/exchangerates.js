import { createAsyncThunk } from "@reduxjs/toolkit";

// https://exchangeratesapi.io/documentation/
const FIXER_BASE_URL = "https://exchange-rates.abstractapi.com/v1";
const FIXER_API_KEY = "b982bf98579448628aecca2fae96a78f";

export const fetchExchangeRates = createAsyncThunk("trips/fetchExchangeRate", async ({ baseCurrency, tripId }, thunkAPI) => {
  const to = thunkAPI.getState().config.currencies.join(",");

  const response = await fetch(`${FIXER_BASE_URL}/live?api_key=${FIXER_API_KEY}&base=${baseCurrency}&target=${to}`, {
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
});
