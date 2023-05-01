import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { ArrowForwardIcon, Box, Divider, HStack, Text, Toast, VStack } from "native-base";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatMoney, roundExchangeRate } from "./logic/util";

import { FlatList } from "react-native";
import NavBreadcrumb from "./NavBreadcrumb";
import NavHeaderButton from "./NavHeaderButtton";
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
        headerTitle: () => <NavBreadcrumb first={trip?.title} second="Exchange Rates" />,
        headerRight: () => <NavHeaderButton icon="download-cloud" onPress={onFetchExchangeRates} />,
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
            <ArrowForwardIcon mx={2} size="xs" />
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

const MoneyComparison = ({ fromCurrency, toCurrency, toValue }) => {
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
