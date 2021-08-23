import { HStack, Text } from "native-base";

import React from "react";
import { formatMoney } from "./logic/util";
import { useTotalMateCost } from "./logic/hooks";

export default function MateListItem({ mate, trip }) {
  const cost = useTotalMateCost(mate, trip);

  return (
    <HStack alignItems="center" justifyContent="space-between" px={2} py={4}>
      <Text fontSize="xl">{mate.name}</Text>
      <Text fontSize="lg">
        {formatMoney(cost)} {trip.baseCurrency}
      </Text>
    </HStack>
  );
}
