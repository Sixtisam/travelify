import { Divider, Fab, HStack, Heading, Icon, IconButton, Text, Toast, View } from "native-base";
import React, { useCallback } from "react";
import { deleteExpense, deleteMate } from "./data/store";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import ExpenseList from "./ExpenseList";
import { Feather } from "@expo/vector-icons";
import { formatMoney } from "./logic/util";
import { getTripSelector } from "./logic/selectors";
import { useTotalMateCost } from "./logic/hooks";

export default function MateDetailScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tripId, mateId } = useRoute().params;
  const trip = useSelector((state) => getTripSelector(state, { tripId }));
  const mate = trip?.mates[mateId];
  const totalCost = useTotalMateCost(mate, trip);

  const onDeleteMate = useCallback(() => {
    navigation.navigate("TripDetail", { tripId });
    dispatch(deleteMate({ tripId, mateId }));
  }, [dispatch, navigation, tripId, mateId]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: () => (
          <HStack alignItems="center">
            <Text color="white" fontSize="lg">
              {trip?.title}
            </Text>
            <Icon color="white" marginX={2} size={4} as={<Feather name="chevron-right" size={24} color="black" />} />
            <Text color="white" fontSize="lg">
              {mate?.name}
            </Text>
          </HStack>
        ),
        headerRight: () => (
          <IconButton variant="solid" icon={<Icon size="sm" color="white" as={<Feather name="trash-2" />} />} onPress={onDeleteMate} />
        ),
      });
    }, [trip?.title, mate?.name, onDeleteMate, navigation])
  );

  const onDeleteExpense = (expenseIndex) => {
    dispatch(deleteExpense({ tripId, mateId, expenseIndex }));
    Toast.show({
      title: "Successfully deleted",
    });
  };

  if (!trip || !mate) {
    return <Text fontSize="lg">Error</Text>;
  }

  const header = (
    <>
      <Heading mx={2} my={4}>
        {mate.name}
      </Heading>
      <HStack px={2} py={4} justifyContent="space-between">
        <Text fontSize="md" fontWeight="bold">
          Total expenses
        </Text>
        <Text fontSize="md" fontWeight="bold">
          {formatMoney(totalCost, trip?.baseCurrency)}
        </Text>
      </HStack>
      <Divider />
    </>
  );
  return (
    <View style={{ flex: 1 }}>
      <ExpenseList expenses={mate?.expenses} onDeleteExpense={onDeleteExpense} ListHeaderComponent={header} />
      <Fab
        renderInPortal={false}
        placement="bottom-right"
        position="absolute"
        size="md"
        icon={<Feather name="plus" size={20} color="white" />}
        label={<Text color="white">Expense</Text>}
        onPress={() => navigation.navigate("CreateExpense", { tripId, mateId })}
      />
    </View>
  );
}
