import { roundExchangeRate } from "./util";
import { useMemo } from "react";

export const calcTotalTripCost = (trip) => {
  if (!trip || !trip.exchangeRates || Object.values(trip.exchangeRates).length === 0) return null;
  return Object.values(trip.mates || {}).reduce((sum, currMate) => {
    return sum + calcTotalMateCost(currMate, trip);
  }, 0);
};
export const calcTotalMateCost = (mate, trip) =>
  (mate.expenses || []).reduce((mSum, currExp) => {
    // convert each expense to base currenc yof trip
    if (!trip.exchangeRates[currExp.currency]) {
      throw Error(`no exchange rate for ${currExp.currency}`);
    }
    const rateToTripBase = roundExchangeRate(1.0 / trip.exchangeRates[currExp.currency]);
    return currExp.amount * rateToTripBase + mSum;
  }, 0);

export function useTotalTripCost(trip) {
  return useMemo(() => calcTotalTripCost(trip), [trip]);
}

export function useTotalMateCost(mate, trip) {
  return useMemo(() => {
    if (!trip || !trip.exchangeRates || Object.values(trip.exchangeRates).length === 0) return null;
    return calcTotalMateCost(mate, trip);
  }, [mate, trip]);
}

export function useSortedMates(trip) {
  return useMemo(() => {
    const mates = Object.values(trip.mates);
    mates.sort((a, b) => a.name - b.name);
    return mates;
  }, [trip.mates]);
}
