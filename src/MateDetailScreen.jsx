import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AddIcon, Button, Divider, Fab, HStack, Text, VStack, View } from "native-base";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteMateAlert from "./DeleteMateAlert";
import ExpenseList from "./ExpenseList";
import NavBreadcrumb from "./NavBreadcrumb";
import NavHeaderButton from "./NavHeaderButtton";
import { useTotalMateConsumption, useTotalMateExpenses } from "./logic/hooks";
import { getTripSelector } from "./logic/selectors";
import { formatMoney } from "./logic/util";

export default function MateDetailScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tripId, mateId } = useRoute().params;
  const trip = useSelector((state) => getTripSelector(state, { tripId }));
  const mate = trip?.mates[mateId];
  const [aboutToDelete, setAboutToDelete] = useState(false);
  const totalExpenses = useTotalMateExpenses(mate, trip);
  const totalConsumption = useTotalMateConsumption(mate, trip);
  const balance = totalExpenses - totalConsumption;

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: () => <NavBreadcrumb first={trip?.title} second={mate?.name} />,
        headerRight: () => <NavHeaderButton icon="trash" onPress={() => setAboutToDelete(true)} />,
      });
    }, [trip?.title, mate?.name, setAboutToDelete, navigation])
  );

  const onCreateExpense = () => navigation.navigate("CreateExpense", { tripId, mateId });

  if (!trip || !mate) {
    return <Text fontSize="lg">Error</Text>;
  }

  const header = (
    <>
      <HStack px={2} py={4} justifyContent="space-between">
        <Text fontSize="md">Total consumption</Text>
        <Text fontSize="md">{formatMoney(totalConsumption, trip?.baseCurrency)}</Text>
      </HStack>
      <HStack px={2} py={4} justifyContent="space-between">
        <Text fontSize="md">Total expenses</Text>
        <Text fontSize="md">{formatMoney(totalExpenses, trip?.baseCurrency)}</Text>
      </HStack>
      <HStack px={2} py={4} justifyContent="space-between">
        <Text fontSize="md">Balance</Text>
        <Text fontSize="md" color={balance < 0 ? "red.500" : "green.500"}>
          {formatMoney(balance, trip?.baseCurrency)}
        </Text>
      </HStack>
      <HStack mt={2} px={2} py={2}>
        <Text fontWeight="semibold">Expenses</Text>
      </HStack>
      <Divider />
    </>
  );

  const emtpyComponent = (
    <VStack py={10} flex={1}>
      <Button mx={2} variant="ghost" size="md" startIcon={<AddIcon />} onPress={onCreateExpense}>
        Expense
      </Button>
    </VStack>
  );

  return (
    <View style={{ flex: 1 }}>
      <ExpenseList tripId={trip.id} mate={mate} ListHeaderComponent={header} ListEmptyComponent={emtpyComponent} />
      <Fab
        renderInPortal={false}
        placement="bottom-right"
        position="absolute"
        size="md"
        icon={<AddIcon />}
        label={<Text color="white">Expense</Text>}
        onPress={onCreateExpense}
      />
      <DeleteMateAlert tripId={tripId} mate={mate} show={aboutToDelete} hide={() => setAboutToDelete(false)} />
    </View>
  );
}
