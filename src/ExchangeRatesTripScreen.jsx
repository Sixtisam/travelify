import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Box, Divider, HStack, Icon, IconButton, Text, Toast, VStack } from "native-base";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatMoney, roundExchangeRate } from "./logic/util";

import { Feather } from "@expo/vector-icons";
import { FlatList } from "react-native";
import { fetchExchangeRates } from "./logic/exchangerates";
import { getTripSelector } from "./logic/selectors";

export default function ExchangeRatesTripScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tripId } = useRoute().params;
  const trip = useSelector((state) => getTripSelector(state, { tripId }));
  const baseCurrency = trip.baseCurrency;
  const exchangeRates = useMemo(() => {
    if (!trip.exchangeRates) {
      dispatch(fetchExchangeRates({ tripId: tripId, baseCurrency: trip.baseCurrency }));
      return [];
    }
    return Object.entries(trip.exchangeRates).map(([currency, rate]) => ({
      currency,
      rate,
    }));
  }, [trip.exchangeRates]);

  const onFetchExchangeRates = useCallback(async () => {
    await dispatch(fetchExchangeRates({ tripId: tripId, baseCurrency: trip.baseCurrency }));
    Toast.show({
      title: "Exchange rates refreshed!",
    });
  }, [dispatch, trip.baseCurrency, tripId]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: () => (
          <HStack alignItems="center" marginLeft={-4}>
            <Text color="white" fontSize="lg">
              {trip?.title}
            </Text>
            <Icon color="white" marginX={2} size={4} as={<Feather name="chevron-right" size={24} color="black" />} />
            <Text color="white" fontSize="lg">
              Exchange Rates
            </Text>
          </HStack>
        ),
        headerRight: () => (
          <IconButton
            variant="solid"
            icon={<Icon size="sm" color="white" as={<Feather name="download-cloud" />} />}
            onPress={onFetchExchangeRates}
          />
        ),
      });
    }, [trip?.title, navigation, onFetchExchangeRates])
  );

  return (
    <VStack>
      <FlatList
        data={exchangeRates}
        keyExtractor={(item) => item.currency}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <HStack paddingX={2} paddingY={3} alignItems="center">
            <Text fontSize="md">{item.currency}</Text>
            <Icon mx={2} size="xs" as={<Feather name="arrow-right" size={24} color="black" />} />
            <Text fontSize="md">{baseCurrency} </Text>
            <Box flex={1} />
            <Text fontSize="md">
              <MoneyComparison fromCurrency={baseCurrency} toCurrency={item.currency} toValue={item.rate} />
            </Text>
          </HStack>
        )}
      />
    </VStack>
  );
}

function MoneyComparison({ fromCurrency, toCurrency, toValue }) {
  const [calcFromVal, calcToVal] = useMemo(() => {
    let f0 = 1.0;
    let t0 = toValue;

    while (t0 < 0.05) {
      f0 *= 10.0;
      t0 *= 10.0;
    }
    return [formatMoney(roundExchangeRate(f0), fromCurrency), formatMoney(roundExchangeRate(t0), toCurrency)];
  }, [toValue, fromCurrency, toCurrency]);

  return (
    <>
      {calcFromVal} = {calcToVal}
    </>
  );
}
