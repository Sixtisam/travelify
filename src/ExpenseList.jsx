import { Divider, HStack, Text, Toast, VStack } from "native-base";
import { formatDateTime, formatMoney } from "./logic/util";

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SwipeListView } from "react-native-swipe-list-view";
import { useDispatch, useSelector } from "react-redux";
import DeleteSwipeBox from "./DeleteSwipeBox";
import MyPressable from "./MyPressable";
import { deleteExpense } from "./data/store";
import { getMateExpensesSelector } from "./logic/selectors";

export default function ExpenseList({ tripId, mate, ListHeaderComponent = null, ListFooterComponent = null, ListEmptyComponent = null }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const expenses = useSelector((state) => getMateExpensesSelector(state, { tripId, mateId: mate.id }));

  const onOpenExpense = (expense) => {
    navigation.navigate("ExpenseDetail", { tripId, expenseId: expense.id });
  };

  const onDeleteExpense = (expense) => {
    dispatch(deleteExpense({ tripId, expense }));
    Toast.show({
      title: "Successfully deleted",
    });
  };

  return (
    <>
      <SwipeListView
        data={expenses}
        keyExtractor={(_, index) => index + ""}
        renderItem={({ item: expense }) => (
          <MyPressable onPress={() => onOpenExpense(expense)} backgroundColor="white">
            <HStack width="100%" paddingX={2} paddingY={6} justifyContent="space-between" alignItems="center">
              <VStack>
                <Text fontSize="lg">{expense.title}</Text>
                <Text fontSize="xs">{formatDateTime(expense.evtCreated)}</Text>
              </VStack>
              <Text fontSize="lg">{formatMoney(expense.amount, expense.currency)}</Text>
            </HStack>
          </MyPressable>
        )}
        disableRightSwipe={true}
        renderHiddenItem={(data, _) => <DeleteSwipeBox onPress={() => onDeleteExpense(data.item)} padding={18} />}
        previewRowKey={"0"}
        rightOpenValue={-70}
        previewOpenValue={-70}
        previewOpenDelay={500}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={() => <Divider />}
      />
    </>
  );
}
