import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Text, Toast, View } from "native-base";
import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpense, updateExpense } from "./data/store";

import ExpenseForm from "./ExpenseForm";
import NavBreadcrumb from "./NavBreadcrumb";
import NavHeaderButton from "./NavHeaderButtton";
import { getExpenseSelector } from "./logic/selectors";

export default function ExpenseDetailScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tripId, expenseId } = useRoute().params;
  const [trip, expense] = useSelector((state) => getExpenseSelector(state, { tripId, expenseId }));
  const expForm = useRef();

  const onDeleteExpense = useCallback(() => {
    dispatch(deleteExpense({ tripId, expense }));
    Toast.show({
      title: "Expense successfully deleted",
    });
    navigation.goBack();
  }, [dispatch, navigation, tripId]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: () => <NavBreadcrumb first={trip?.title} second={"Expense"} />,
        headerRight: () => <NavHeaderButton icon="check" size="md" onPress={() => expForm.current.submit()} />,
      });
    }, [trip?.title, expForm, navigation])
  );

  const onSubmitExpense = (expense) => {
    dispatch(updateExpense({ tripId, expense }));
    navigation.goBack();
  };

  if (!trip || !expense) {
    return <Text fontSize="lg">Error</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <ExpenseForm ref={expForm} trip={trip} expense={expense} onSubmit={onSubmitExpense} onDelete={onDeleteExpense} />
    </View>
  );
}
