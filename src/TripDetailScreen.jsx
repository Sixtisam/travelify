import {
  AlertDialog,
  Box,
  Button,
  Divider,
  Fab,
  HStack,
  Heading,
  Icon,
  IconButton,
  Text,
  VStack,
  useDisclose,
  useToast,
} from "native-base";
import React, { useCallback, useState } from "react";
import { deleteMate, deleteTrip } from "./data/store";
import { formatDateTime, formatMoney } from "./logic/util";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useSortedMates, useTotalTripCost } from "./logic/hooks";

import DebtsList from "./DebtsList";
import DeleteSwipeBox from "./DeleteSwipeBox";
import { Feather } from "@expo/vector-icons";
import MateListItem from "./MateListItem";
import MyPressable from "./MyPressable";
import { SwipeListView } from "react-native-swipe-list-view";
import { fetchExchangeRates } from "./logic/exchangerates";
import { getTripSelector } from "./logic/selectors";

export default function TripDetailScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tripId } = useRoute().params;
  const trip = useSelector((state) => getTripSelector(state, { tripId }));
  const totalCost = useTotalTripCost(trip);
  const toast = useToast();
  const mates = useSortedMates(trip);

  const onDeleteTrip = useCallback(() => {
    dispatch(deleteTrip({ tripId }));
    navigation.navigate("Home");
  }, [trip]);
  const onCreateMate = useCallback(() => {
    navigation.navigate("CreateMate", { tripId });
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: trip?.title,
        headerRight: () => (
          <IconButton variant="solid" icon={<Icon size="sm" color="white" as={<Feather name="trash-2" />} />} onPress={onDeleteTrip} />
        ),
      });
    }, [trip?.title, onDeleteTrip])
  );

  const onFetchExchangeRates = async () => {
    await dispatch(fetchExchangeRates({ tripId: tripId, baseCurrency: trip.baseCurrency }));
    toast.show({
      title: "Exchange rates refreshed!",
    });
  };

  const showExchangeRate = () => {
    navigation.navigate("ExchangeRatesTrip", { tripId });
  };

  const { isOpen: delConfirmDialogOpen, onOpen: onDelConfirmDialogOpen, onClose: onDelConfirmDialogClose } = useDisclose();
  const [mateToDelete, setMateToDelete] = useState(null);
  const onPreselectMateForDelete = (mate) => {
    setMateToDelete(mate.id);
    onDelConfirmDialogOpen();
  };

  const onDeleteMate = () => {
    onDelConfirmDialogClose();
    dispatch(deleteMate({ tripId, mateId: mateToDelete }));
    setMateToDelete(null);
  };
  if (!trip) {
    return <Text fontSize="lg">Error</Text>;
  }

  const onMatePress = (mate) => {
    navigation.navigate("MateDetail", { tripId: trip.id, mateId: mate.id });
  };

  const aboveList = (
    <VStack space={2} marginTop={2}>
      <HStack justifyContent="space-between" alignItems="center" px={2} py={2}>
        <Text fontSize="md">Total cost</Text>
        <Text fontSize="md">
          {formatMoney(totalCost, trip?.baseCurrency)}
        </Text>
      </HStack>
      <Divider />
      <HStack justifyContent="space-between" alignItems="center" px={2} py={2}>
        <Text fontSize="md">Exchange Rates Date</Text>
        <Text fontSize="md">{formatDateTime(trip?.evtExchangeRate)}</Text>
      </HStack>
      <HStack justifyContent="space-between">
        <Button variant="link" size="xs" onPress={showExchangeRate}>
          Show exchange rates
        </Button>
        <Button variant="link" size="xs" onPress={onFetchExchangeRates}>
          Fetch latest exchange rates
        </Button>
      </HStack>
      <Heading size="lg" mx={2} py={2}>
        Mates
      </Heading>
    </VStack>
  );

  const belowList = (
    <Box>
      <HStack justifyContent="flex-end">
        <Button onPress={onCreateMate} variant="link">
          Add mate
        </Button>
      </HStack>
      <DebtsList trip={trip} />
      {mates.length === 0 ? null : (
        <Fab
          renderInPortal={false}
          placement="bottom-right"
          position="absolute"
          size="md"
          icon={<Feather name="plus" size={20} color="white" />}
          label={<Text color="white">Expense</Text>}
          onPress={() => navigation.navigate("CreateExpense", { tripId })}
        />
      )}

      <Box height={100}>{/*space-for-fab*/}</Box>
      <AlertDialog isOpen={delConfirmDialogOpen} onClose={onDelConfirmDialogClose} motionPreset={"fade"}>
        <AlertDialog.Content>
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            Delete mate
          </AlertDialog.Header>
          <AlertDialog.Body>Are you sure? You can't undo this action afterwards.</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button onPress={onDelConfirmDialogClose}>Cancel</Button>
            <Button colorScheme="red" onPress={onDeleteMate} ml={3} _text={{ color: "white" }}>
              Delete
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Box>
  );

  return (
    <SwipeListView
      data={mates}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <Divider />}
      renderItem={({ item: mate }) => (
        <MyPressable onPress={() => onMatePress(mate)} backgroundColor="white">
          <MateListItem mate={mate} trip={trip} />
        </MyPressable>
      )}
      renderHiddenItem={(data, _) => <DeleteSwipeBox onPress={() => onPreselectMateForDelete(data.item)} padding={14} />}
      rightOpenValue={-70}
      disableRightSwipe={true}
      ListEmptyComponent={
        <VStack alignItems="center">
          <Text fontSize="lg" m={3}>
            You have no mates yet!
          </Text>
        </VStack>
      }
      ListHeaderComponent={aboveList}
      ListFooterComponent={belowList}
    />
  );
}
