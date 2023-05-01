import { createIdSelector, createSelector } from "redux-views";

export const getTripIdSelector = createIdSelector((props) => props.tripId);
export const getMateIdSelector = createIdSelector((props) => props.mateId);
export const getExpenseIdSelector = createIdSelector((props) => props.expenseId);
export const getAllTripsSelector = (state) => state.trips;
export const getMateNamesSelector = (state) => state.mateNames;
export const getCurrenciesSelector = (state) => state.config.currencies;

export const getAllTripsSortedSelector = createSelector([getAllTripsSelector], (trips) => {
  const tripList = Object.values(trips);
  tripList.sort((a, b) => b.evtCreated - a.evtCreated);
  return tripList;
});

export const getMateNameProposalsSelector = createSelector(
  [getMateNamesSelector, getAllTripsSelector, getTripIdSelector],
  (availableMateNames, trips, tripId) => {
    const trip = trips[tripId];
    const alreadyMateNames = Object.values(trip.mates).map((mate) => mate.name);

    return availableMateNames.filter((name) => !alreadyMateNames.includes(name));
  }
);

export const getTripSelector = createSelector([getTripIdSelector, getAllTripsSelector], (tripId, trips) => trips[tripId]);

export const getMateSelector = createSelector([getTripIdSelector, getMateIdSelector, getAllTripsSelector], (tripId, mateId, trips) => [
  trips[tripId],
  trips[tripId].mates[mateId],
]);

export const getMateExpensesSelector = createSelector(
  [getTripIdSelector, getMateIdSelector, getAllTripsSelector],
  (tripId, mateId, trips) => (Object.values(trips[tripId].expenses) || []).filter((exp) => exp.mateId === mateId)
);

export const getExpenseSelector = createSelector(
  [getTripIdSelector, getExpenseIdSelector, getAllTripsSelector],
  (tripId, expenseId, trips) => [trips[tripId], trips[tripId].expenses[expenseId]]
);
