import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createTrip } from "../logic/trips";
import { fetchExchangeRates } from "../logic/exchangerates";
import { getCurrentTimestampSec } from "../logic/util";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

export const tripsSlice = createSlice({
  name: "trips",
  initialState: {
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
  },
  reducers: {
    deleteTrip: (state, { payload: { tripId } }) => {
      delete state[tripId];
    },
    deleteExpense: (state, { payload: { tripId, mateId, expenseIndex } }) => {
      state[tripId].mates[mateId].expenses.splice(expenseIndex, 1);
    },
    deleteMate: (state, { payload: { tripId, mateId } }) => {
      delete state[tripId].mates[mateId];
    },
    createMate: (state, { payload: { tripId, mate } }) => {
      state[tripId].mates[mate.id] = { ...mate };
    },
    createExpense: (state, { payload: { tripId, mateId, expense } }) => {
      state[tripId].mates[mateId].expenses.unshift(expense);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createTrip.fulfilled, (state, { payload }) => {
      state[payload.id] = payload;
    });
    builder.addCase(fetchExchangeRates.fulfilled, (state, { payload }) => {
      const { tripId, evtExchangeRate, exchangeRates } = payload;
      state[tripId].evtExchangeRate = evtExchangeRate;
      state[tripId].exchangeRates = exchangeRates;
    });
  },
});
export const {
  createMate,
  deleteExpense,
  deleteMate,
  deleteTrip,
  createExpense,
} = tripsSlice.actions;

export const mateNamesSlice = createSlice({
  name: "mateNames",
  initialState: ["Sam", "Samuel", "Cédric", "Severin", "Julian"],
  reducers: {
    addMateName: (state, { payload }) => {
      if (!state.includes(payload) && payload.trim() !== "") {
        state.unshift(payload);
      }
    },
  },
});
export const { addMateName } = mateNamesSlice.actions;

export const configSlice = createSlice({
  name: "config",
  initialState: {
    currencies: ["CHF", "EUR", "USD", "GBP", "NOK"],
  },
  reducers: {
    addCurrency: (state, { payload }) => {
      if (!state.includes(payload)) {
        state.push(payload);
      }
    },
  },
});
export const { addCurrency } = configSlice.actions;

const rootReducer = combineReducers({
  trips: tripsSlice.reducer,
  mateNames: mateNamesSlice.reducer,
  config: configSlice.reducer,
});
const persistConfig = {
  key: "globale_app_state",
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
