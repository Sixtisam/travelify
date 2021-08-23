import { AddIcon, AlertDialog, Button, Divider, Fab, HStack, Text, VStack, useDisclose } from "native-base";
import React, { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import DeleteSwipeBox from "./DeleteSwipeBox";
import MyPressable from "./MyPressable";
import { SwipeListView } from "react-native-swipe-list-view";
import { View } from "react-native";
import { deleteTrip } from "./data/store";
import { formatMoney } from "./logic/util";
import { getAllTripsSortedSelector } from "./logic/selectors";
import { useNavigation } from "@react-navigation/native";
import { useTotalTripCost } from "./logic/hooks";

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
          <Text>
            {formatMoney(totalTripCost)} {trip.baseCurrency}
          </Text>
        </VStack>
      </HStack>
    </MyPressable>
  );
}

export default function TripListScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const data = useSelector(getAllTripsSortedSelector);
  const onCreateTrip = () => {
    navigation.navigate("CreateTrip");
  };
  const listViewRef = useRef();

  const { isOpen: tripConfirmDialogOpen, onOpen: openTripConfirmDialog, onClose: closeTripConfirmDialog } = useDisclose();
  const [tripToDelete, setTripToDelete] = useState(null);
  const preselectTripForDelete = (trip) => {
    setTripToDelete(trip.id);
    openTripConfirmDialog();
  };

  const onDeleteTrip = () => {
    dispatch(deleteTrip({ tripId: tripToDelete }));
    closeTripConfirmDialog();
    setTripToDelete(null);
  };

  if (data.length === 0) {
    return (
      <View flex={1}>
        <VStack flex={1} alignItems="center" justifyContent="center">
          <Text fontSize="lg">You have no trips yet!</Text>
          <Button variant="link" onPress={onCreateTrip}>
            Create one
          </Button>
        </VStack>
        <Fab renderInPortal={false} position="absolute" placement="bottom-right" size="lg" icon={<AddIcon />} onPress={onCreateTrip} />
      </View>
    );
  }

  return (
    <View flex={1}>
      <SwipeListView
        data={data}
        renderItem={({ item }) => <TripListItem trip={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
        renderHiddenItem={(data, _) => <DeleteSwipeBox onPress={() => preselectTripForDelete(data.item)} padding={30} />}
        rightOpenValue={-90}
        ListFooterComponent={
          <>
            <Fab renderInPortal={false} position="absolute" size="lg" icon={<AddIcon />} onPress={onCreateTrip} />
            <AlertDialog isOpen={tripConfirmDialogOpen} onClose={closeTripConfirmDialog} motionPreset={"fade"}>
              <AlertDialog.Content>
                <AlertDialog.Header fontSize="lg" fontWeight="bold">
                  Delete trip
                </AlertDialog.Header>
                <AlertDialog.Body>Are you sure? You can&apos;t undo this action afterwards.</AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button onPress={closeTripConfirmDialog}>Cancel</Button>
                  <Button ml={3} _text={{ color: "white" }} onPress={onDeleteTrip}>
                    Delete
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>
          </>
        }
      />
    </View>
  );
}
