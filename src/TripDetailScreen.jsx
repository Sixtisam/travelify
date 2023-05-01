import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { AddIcon, Box, Button, Divider, Fab, HStack, Heading, Text, Toast, VStack } from "native-base";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSortedMates, useTotalTripCost } from "./logic/hooks";
import { formatDateTime, formatMoney } from "./logic/util";

import { SwipeListView } from "react-native-swipe-list-view";
import DebtsList from "./DebtsList";
import DeleteMateAlert from "./DeleteMateAlert";
import DeleteSwipeBox from "./DeleteSwipeBox";
import DeleteTripAlert from "./DeleteTripAlert";
import MateListItem from "./MateListItem";
import MyPressable from "./MyPressable";
import NavHeaderButton from "./NavHeaderButtton";
import { fetchExchangeRates } from "./logic/exchangerates";
import { getTripSelector } from "./logic/selectors";

export default function TripDetailScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tripId } = useRoute().params;
  const trip = useSelector((state) => getTripSelector(state, { tripId }));
  const [aboutToDelete, setAboutToDelete] = useState(false);
  const [mateToDelete, setMateToDelete] = useState(null);
  const totalCost = useTotalTripCost(trip);
  const mates = useSortedMates(trip);

  const onCreateMate = useCallback(() => navigation.navigate("CreateMate", { tripId }), []);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: trip?.title,
        headerRight: () => <NavHeaderButton icon="trash" onPress={() => setAboutToDelete(true)} />,
      });
    }, [trip?.title, setAboutToDelete])
  );

  const onFetchExchangeRates = async () => {
    await dispatch(fetchExchangeRates({ tripId: tripId, baseCurrency: trip.baseCurrency }));
    Toast.show({
      title: "Exchange rates refreshed!",
    });
  };

  const showExchangeRate = () => {
    navigation.navigate("ExchangeRatesTrip", { tripId });
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
        <Text fontSize="md">{formatMoney(totalCost, trip?.baseCurrency)}</Text>
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
          icon={<AddIcon />}
          label={<Text color="white">Expense</Text>}
          onPress={() => navigation.navigate("CreateExpense", { tripId })}
        />
      )}

      <Box height={100}>{/*space-for-fab*/}</Box>
      <DeleteMateAlert tripId={tripId} mate={mateToDelete} show={!!mateToDelete} hide={() => setMateToDelete(null)} />
      <DeleteTripAlert tripId={tripId} show={aboutToDelete} hide={() => setAboutToDelete(false)} />
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
      renderHiddenItem={(data, _) => <DeleteSwipeBox onPress={() => setMateToDelete(data.item)} padding={14} />}
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
