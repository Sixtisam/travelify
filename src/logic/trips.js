import { generateId, getCurrentTimestampSec } from "./util";

import { createAsyncThunk } from "@reduxjs/toolkit";

export const createTrip = createAsyncThunk("trips/create", async ({ title, baseCurrency, mateNames }, thunkAPI) => {
  const newTripId = generateId();
  const mates = {};
  mateNames.forEach((name) => {
    const id = generateId();
    mates[id] = {
      id,
      name,
      evtCreated: getCurrentTimestampSec(),
      expenses: [],
    };
  });
  return {
    id: newTripId,
    title,
    baseCurrency,
    evtCreated: getCurrentTimestampSec(),
    mates,
    expenses: {},
  };
});
