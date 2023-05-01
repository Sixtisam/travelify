import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTripSelector } from "./logic/selectors";

import ExpenseForm from "./ExpenseForm";
import { createExpense } from "./data/store";
import { generateId, getCurrentTimestampSec } from "./logic/util";
import NavHeaderButton from "./NavHeaderButtton";
import { CheckIcon } from "native-base";

export default function CreateExpenseScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { tripId, mateId = null } = useRoute().params;
  const expForm = useRef();

  const trip = useSelector((state) => getTripSelector(state, { tripId }));
  const optMate = trip?.mates[mateId] || null;
  const [expense, setExpense] = useState({ shares: {} });

  useFocusEffect(
    useCallback(() => {
      setExpense({
        id: generateId(),
        title: "",
        amount: 0.0,
        currency: trip.baseCurrency,
        autoCalc: true,
        mateId: optMate?.id || null,
        evtCreated: getCurrentTimestampSec(),
        // by default, all mates participate
        shares: Object.fromEntries(Object.values(trip.mates).map((m) => [m.id, 0.0])),
      });
      navigation.setOptions({
        headerRight: () => <NavHeaderButton icon={CheckIcon} onPress={() => expForm.current.submit()} />,
      });
    }, [trip, optMate, expForm])
  );

  const onSubmit = (expense) => {
    dispatch(createExpense({ tripId, expense }));
    navigation.goBack();
  };

  return <ExpenseForm ref={expForm} trip={trip} expense={expense} onSubmit={onSubmit} />;
}
