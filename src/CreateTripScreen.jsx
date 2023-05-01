import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AddIcon, Button, CheckIcon, Divider, FormControl, HStack, Input, Select, Text, VStack, View, useToken } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";

import { ScrollView } from "react-native";
import MyPressable from "./MyPressable";
import NavHeaderButton from "./NavHeaderButtton";
import { fetchExchangeRates } from "./logic/exchangerates";
import { getCurrenciesSelector } from "./logic/selectors";
import { createTrip } from "./logic/trips";

export default function CreateTripScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const reduxStore = useStore();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    baseCurrency: reduxStore.getState().config?.currencies.length > 0 ? reduxStore.getState().config?.currencies[0] : "CHF",
  });

  const [mateNames, setMateNames] = useState([]);
  const availableCurrencies = useSelector(getCurrenciesSelector);
  const [greenColor] = useToken("colors", ["primary.500", "green.500"]);

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

  const setFieldData = (field, value) => {
    setFormData({ ...formData, [field]: value });
    const newFormErrors = { ...formErrors };
    delete newFormErrors[field];
    setFormErrors(newFormErrors);
  };

  const validate = useCallback(() => {
    const newFormErrors = {};
    if (formData["title"] == null || formData["title"].trim().length === 0) {
      newFormErrors["title"] = "Title is missing";
    }
    if (formData["baseCurrency"] == null) {
      newFormErrors["baseCurrency"] = "Currency is missing";
    }
    setFormErrors(newFormErrors);
    return Object.values(newFormErrors).length === 0;
  }, [formData, formErrors]);

  const onSubmit = useCallback(async () => {
    if (!validate()) {
      return;
    }
    const { payload: trip } = await dispatch(
      createTrip({
        title: formData.title,
        baseCurrency: formData.baseCurrency,
        mateNames: mateNames.filter((el) => el.include).map((el) => el.name),
      })
    );
    navigation.navigate("Home");
    dispatch(fetchExchangeRates({ tripId: trip.id, baseCurrency: trip.baseCurrency }));
  }, [formData, mateNames, validate, dispatch, navigation]);

  useEffect(() => {
    navigation.setOptions({ headerRight: () => <NavHeaderButton icon="check" onPress={onSubmit} /> });
  }, [onSubmit]);

  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <VStack alignItems="center" px={2} marginTop={2} space={1}>
        <FormControl isRequired isInvalid={"title" in formErrors}>
          <Input placeholder="Title..." value={formData.title} autoFocus onChangeText={(val) => setFieldData("title", val)} />
          {"title" in formErrors ? <FormControl.ErrorMessage>{formErrors["title"]}</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={"baseCurrency" in formErrors}>
          <Select
            placeholder="Base Currency..."
            selectedValue={formData.baseCurrency}
            onValueChange={(val) => setFieldData("baseCurrency", val)}
            _selectedItem={{ bg: "primary.400" }}
          >
            {availableCurrencies.map((currency) => (
              <Select.Item
                label={currency}
                value={currency}
                key={currency}
                _text={{
                  color: currency === formData["baseCurrency"] ? "white" : "black",
                }}
              />
            ))}
          </Select>
          {"baseCurrency" in formErrors ? <FormControl.ErrorMessage>{formErrors["baseCurrency"]}</FormControl.ErrorMessage> : null}
        </FormControl>
      </VStack>
      {mateNames.length === 0 ? null : (
        <Text fontSize="lg" mx={2} my={2}>
          Select mates
        </Text>
      )}
      {mateNames.map(({ name, include }, index) => (
        <View key={name}>
          {index !== 0 ? <Divider /> : null}
          <MyPressable onPress={() => toggleMate(name)}>
            <HStack justifyContent="space-between" alignItems="center" px={2} py={5} shadow={2}>
              <Text fontSize="lg" mt={-1}>
                {name}
              </Text>
              {include ? <CheckIcon size="sm" color={greenColor} mr={2} /> : <AddIcon size="sm" mr={2} />}
            </HStack>
          </MyPressable>
        </View>
      ))}
      <Button m={2} onPress={onSubmit} startIcon={<CheckIcon />}>
        Save
      </Button>
    </ScrollView>
  );
}
