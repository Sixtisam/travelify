import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createTrip } from "../logic/trips";
import { fetchExchangeRates } from "../logic/exchangerates";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import * as Localization from "expo-localization";

export const tripsSlice = createSlice({
  name: "trips",
  initialState: {},
  reducers: {
    deleteTrip: (state, { payload: { tripId } }) => {
      delete state[tripId];
    },
    createMate: (state, { payload: { tripId, mate } }) => {
      state[tripId].mates[mate.id] = { ...mate };
    },
    deleteMate: (state, { payload: { tripId, mateId } }) => {
      delete state[tripId].mates[mateId];
    },
    createExpense: (state, { payload: { tripId, expense } }) => {
      state[tripId].expenses[expense.id] = expense;
    },
    updateExpense: (state, {payload: {tripId, expense}}) => {
      state[tripId].expenses[expense.id] = expense;
    },
    deleteExpense: (state, { payload: { tripId, expense } }) => {
      delete state[tripId].expenses[expense.id];
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
export const { createMate, deleteExpense, deleteMate, deleteTrip, createExpense, updateExpense } = tripsSlice.actions;

export const mateNamesSlice = createSlice({
  name: "mateNames",
  initialState: ["Sam", "Samuel", "Cédric", "Severin", "Julian"],
  reducers: {
    addMateName: (state, { payload }) => {
      const idx = state.findIndex((el) => el.toUpperCase() === payload.toUpperCase());
      if (idx === -1 && payload.trim() !== "") {
        state.unshift(payload);
      }
    },
    deleteMateName: (state, { payload }) => {
      const idx = state.findIndex((el) => el.toUpperCase() === payload.toUpperCase());
      if (idx !== -1) state.splice(idx, 1);
    },
  },
});
export const { addMateName, deleteMateName } = mateNamesSlice.actions;

const initialCurrencies = () => {
  const ls = new Set();
  ls.add("CHF");
  ls.add("EUR");
  ls.add("USD");
  ls.add("GBP");
  ls.add("NOK");
  ls.add("IDR");
  ls.add(Localization.currency);
  return Array.from(ls);
}

export const configSlice = createSlice({
  name: "config",
  initialState: {
    currencies: initialCurrencies(),
  },
  reducers: {
    addCurrency: (state, { payload }) => {
      if (!state.currencies.includes(payload.toUpperCase())) {
        state.currencies.push(payload.toUpperCase());
      }
    },
    deleteCurrency: (state, { payload }) => {
      const idx = state.currencies.findIndex((el) => el === payload.toUpperCase());
      if (idx !== -1) state.currencies.splice(idx, 1);
    },
  },
});
export const { addCurrency, deleteCurrency } = configSlice.actions;

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
