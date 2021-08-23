import { Divider, HStack, Text, useToken } from "native-base";
import { formatDateTime, formatMoney } from "./logic/util";

import DeleteSwipeBox from "./DeleteSwipeBox";
import React from "react";
import { SwipeListView } from "react-native-swipe-list-view";

export default function ExpenseList({ expenses, onDeleteExpense, ListHeaderComponent = null, ListFooterComponent = null }) {
  const [bgColor] = useToken("colors", ["white"]);
  return (
    <>
      <SwipeListView
        data={expenses}
        keyExtractor={(_, index) => index + ""}
        renderItem={({ item }) => (
          <HStack width="100%" paddingX={2} paddingY={6} justifyContent="space-between" backgroundColor={bgColor}>
            <Text fontSize="lg">{formatDateTime(item.evtCreated)}</Text>
            <Text fontSize="lg">
              {formatMoney(item.amount)} {item.currency}
            </Text>
          </HStack>
        )}
        disableRightSwipe={true}
        renderHiddenItem={(data, _) => <DeleteSwipeBox onPress={() => onDeleteExpense(data.index)} padding={18} />}
        previewRowKey={"0"}
        rightOpenValue={-70}
        previewOpenValue={-70}
        previewOpenDelay={500}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={() => <Divider />}
      />
    </>
  );
}
