import { AddIcon, Box, Button, Divider, Fab, HStack, HamburgerIcon, Text, VStack } from "native-base";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { useNavigation } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import DeleteSwipeBox from "./DeleteSwipeBox";
import DeleteTripAlert from "./DeleteTripAlert";
import MyPressable from "./MyPressable";
import NavHeaderButton from "./NavHeaderButtton";
import { useTotalTripCost } from "./logic/hooks";
import { getAllTripsSortedSelector } from "./logic/selectors";
import { formatMoney } from "./logic/util";

export function TripListItem({ trip }) {
  const navigation = useNavigation();
  const totalTripCost = useTotalTripCost(trip);
  const mateNames = useMemo(() => {
    return Object.values(trip.mates)
      .map((mate) => mate.name)
      .join(", ");
  }, [trip.mates]);

  const onOpenTrip = () => {
    navigation.navigate("TripDetail", { tripId: trip.id });
  };

  return (
    <MyPressable onPress={onOpenTrip} backgroundColor="white">
      <HStack paddingY={2}>
        <VStack alignItems="flex-start" m={2} flex={1}>
          <Text fontSize="4xl">{trip.title}</Text>
          <Text fontSize="sm">{mateNames}</Text>
        </VStack>
        <VStack justifyContent="center" alignItems="center" m={4}>
          <Text>{formatMoney(totalTripCost, trip.baseCurrency)}</Text>
        </VStack>
      </HStack>
    </MyPressable>
  );
}

export default function TripListScreen() {
  const navigation = useNavigation();
  const data = useSelector(getAllTripsSortedSelector);
  const onCreateTrip = useCallback(() => {
    navigation.navigate("CreateTrip");
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <NavHeaderButton icon={HamburgerIcon} onPress={() => navigation.openDrawer()} />,
    });
  }, [navigation]);

  const [tripToDelete, setTripToDelete] = useState(null);

  return (
    <SwipeListView
      data={data}
      renderItem={({ item }) => <TripListItem trip={item} />}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <Divider />}
      renderHiddenItem={(data, _) => <DeleteSwipeBox onPress={() => setTripToDelete(data.item.id)} padding={30} />}
      rightOpenValue={-90}
      ListEmptyComponent={
        <VStack flex={1} alignItems="center" justifyContent="center">
          <Text fontSize="lg">You have no trips yet!</Text>
          <Button variant="link" onPress={onCreateTrip}>
            Create one
          </Button>
        </VStack>
      }
      style={{ flex: 1 }}
      contentContainerStyle={{ flex: data.length === 0 ? 1 : undefined }}
      ListFooterComponent={
        <VStack>
          <Box height={90} />
          <Fab renderInPortal={false} position="absolute" size="lg" icon={<AddIcon />} onPress={onCreateTrip} />
          <DeleteTripAlert show={!!tripToDelete} tripId={tripToDelete} hide={() => setTripToDelete(null)} />
        </VStack>
      }
    />
  );
}
