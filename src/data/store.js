import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import { combineReducers, configureStore, createSlice } from "@reduxjs/toolkit";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createTrip } from "../logic/trips";
import { fetchExchangeRates } from "../logic/exchangerates";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

export const tripsSlice = createSlice({
  name: "trips",
  initialState: {},
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
export const { createMate, deleteExpense, deleteMate, deleteTrip, createExpense } = tripsSlice.actions;

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

export const configSlice = createSlice({
  name: "config",
  initialState: {
    currencies: ["CHF", "EUR", "USD", "GBP", "NOK"],
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
