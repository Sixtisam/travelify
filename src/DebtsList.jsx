import * as Clipboard from "expo-clipboard";

import { Box, Divider, HStack, Heading, Icon, Text, Toast } from "native-base";
import React, { useMemo } from "react";

import { Feather } from "@expo/vector-icons";
import { FlatList } from "react-native";
import MyPressable from "./MyPressable";
import { calcDebts } from "./logic/calc-debts";
import { formatMoney } from "./logic/util";

export default function DebtsList({ trip }) {
  const debts = useMemo(() => {
    return calcDebts(trip);
  }, [trip]);

  const onDebtPress = (debt) => {
    Clipboard.setStringAsync(debt.amount + "");
    Toast.show({
      title: `Copied ${formatMoney(debt.amount, trip.baseCurrency)} to clipboard!`,
    });
  };

  return (
    <Box>
      <Heading size="lg" mx={2} my={2}>
        Debts
      </Heading>
      <FlatList
        data={debts}
        keyExtractor={(_, index) => index + ""}
        renderItem={({ item: debt, index }) => (
          <MyPressable onPress={() => onDebtPress(debt)}>
            <HStack key={index} px={2} py={4} alignItems="center" justifyContent="center">
              <Text fontSize="lg">{trip.mates[debt.from].name}</Text>
              <Icon marginX={2} size="xs" as={<Feather name="arrow-right" />} />
              <Text fontSize="lg">{trip.mates[debt.to].name}</Text>
              <Box flex={1} />
              <Text fontSize="lg">
                {formatMoney(debt.amount, trip.baseCurrency)}
              </Text>
            </HStack>
          </MyPressable>
        )}
        ItemSeparatorComponent={() => <Divider />}
        ListEmptyComponent={
          <HStack alignItems="center" justifyContent="center">
            <Text fontSize="lg">Nobody has debts!</Text>
          </HStack>
        }
      />
    </Box>
  );
}
