import { useMemo } from "react";
import { roundExchangeRate } from "./util";

export const calcTotalTripCost = (trip) => {
  if (!trip || !trip.exchangeRates || Object.values(trip.exchangeRates).length === 0) return null;
  return Object.values(trip.expenses || {}).reduce((sum, currExpense) => {
    return sum + convertToCurrency(currExpense.amount, currExpense.currency, trip);
  }, 0);
};

export const getRateToTripBase = (trip, currency) => {
  if (!trip.exchangeRates[currency]) {
    throw Error(`no exchange rate for ${currency}`);
  }
  return roundExchangeRate(1.0 / trip.exchangeRates[currency]);
};

export const convertToCurrency = (amount, currency, trip) => {
  return amount * getRateToTripBase(trip, currency);
};

export const calcTotalMateExpenses = (mate, trip) =>
  (Object.values(trip.expenses) || [])
    .filter((exp) => exp.mateId === mate.id)
    .reduce((mSum, currExp) => mSum + convertToCurrency(currExp.amount, currExp.currency, trip), 0);

export const calcTotalMateConsumption = (mate, trip) =>
  (Object.values(trip.expenses) || [])
    .filter((exp) => mate.id in exp.shares)
    .reduce((mSum, currExp) => mSum + convertToCurrency(currExp.shares[mate.id], currExp.currency, trip), 0);

export function useTotalTripCost(trip) {
  return useMemo(() => calcTotalTripCost(trip), [trip]);
}

export function useTotalMateExpenses(mate, trip) {
  return useMemo(() => {
    if (!trip || !mate || !trip.exchangeRates || Object.values(trip.exchangeRates).length === 0) return null;
    return calcTotalMateExpenses(mate, trip);
  }, [mate, trip]);
}

export function useTotalMateConsumption(mate, trip) {
  return useMemo(() => {
    if (!trip || !mate ||  !trip.exchangeRates || Object.values(trip.exchangeRates).length === 0) return null;
    return calcTotalMateConsumption(mate, trip);
  }, [mate, trip]);
}

export function useSortedMates(trip) {
  return useMemo(() => {
    const mates = Object.values(trip.mates);
    mates.sort((a, b) => a.name - b.name);
    return mates;
  }, [trip.mates]);
}
