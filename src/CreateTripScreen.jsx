import { Button, CheckIcon, Divider, HStack, Icon, Input, Select, Text, VStack } from "native-base";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Feather } from "@expo/vector-icons";
import MyPressable from "./MyPressable";
import { ScrollView } from "react-native";
import { createTrip } from "./logic/trips";
import { fetchExchangeRates } from "./logic/exchangerates";

export default function CreateTripScreen() {
  const [tripTitle, setTripTitle] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("");
  const [mateNames, setMateNames] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const reduxStore = useStore();
  const availableCurrencies = useSelector((state) => state.config.currencies);

  useFocusEffect(
    useCallback(() => {
      setMateNames(reduxStore.getState().mateNames.map((name) => ({ name, include: false })));
    }, [reduxStore])
  );

  const toggleMate = (name) => {
    setMateNames(
      mateNames.map((entry) => {
        if (entry.name === name) {
          return { name, include: !entry.include };
        } else {
          return entry;
        }
      })
    );
  };

  const onSubmit = async () => {
    const { payload: trip } = await dispatch(
      createTrip({
        title: tripTitle,
        baseCurrency,
        mateNames: mateNames.filter((el) => el.include).map((el) => el.name),
      })
    );
    navigation.navigate("Home");
    dispatch(fetchExchangeRates({ tripId: trip.id, baseCurrency: trip.baseCurrency }));
  };

  return (
    <ScrollView>
      <VStack justifyContent="center" px={2} py={4} space={1}>
        <Input placeholder="Title..." value={tripTitle} onChangeText={(val) => setTripTitle(val)} />
        <Select
          placeholder="Base currency..."
          selectedValue={baseCurrency}
          style={{ margin: 6 }}
          minWidth={200}
          onValueChange={(val) => setBaseCurrency(val)}
          _selectedItem={{
            bg: "primary.500",
            endIcon: <CheckIcon size={4} />,
          }}
        >
          {availableCurrencies.map((currency) => (
            <Select.Item label={currency} value={currency} key={currency} />
          ))}
        </Select>
      </VStack>
      {mateNames.length === 0 ? null : (
        <Text fontSize="lg" mx={2} my={2}>
          Select mates
        </Text>
      )}
      {mateNames.map(({ name, include }, index) => (
        <>
          {index !== 0 ? <Divider /> : null}
          <MyPressable key={name} onPress={() => toggleMate(name)}>
            <HStack justifyContent="space-between" px={2} py={4} shadow={2}>
              <Text fontSize="md">{name}</Text>
              <Icon
                size={6}
                as={include ? <Feather name="check" color="black" size={20} /> : <Feather name="plus" color="black" size={20} />}
              />
            </HStack>
          </MyPressable>
        </>
      ))}
      <Button m={2} onPress={onSubmit}>
        Save
      </Button>
    </ScrollView>
  );
}
