import { Button, FormControl, Icon, Input, Select, VStack } from "native-base";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { getCurrenciesSelector, getTripSelector } from "./logic/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { createExpense } from "./data/store";
import { getCurrentTimestampSec } from "./logic/util";

export default function CreateExpenseScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tripId, mateId } = useRoute().params;
  const availableCurrencies = useSelector(getCurrenciesSelector);
  const amountRef = useRef();

  const [formData, setFormData] = useState({
    mateId: mateId,
    currency: availableCurrencies[0],
    amount: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const trip = useSelector((state) => getTripSelector(state, { tripId }));
  const tripMates = useMemo(() => Object.values(trip.mates), [trip.mates]);

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        // TODO works only with timeout
        amountRef.current?.focus();
      }, 100);
    }, [amountRef])
  );

  const validate = () => {
    const newFormErrors = {};
    const amountAsNr = Number(formData.amount);
    if (isNaN(amountAsNr) || amountAsNr <= 0) {
      newFormErrors["amount"] = "No valid number";
    }
    if (formData.mateId == null) {
      newFormErrors["mateId"] = "Chose a mate";
    }
    if (formData.currency == null) {
      newFormErrors["currency"] = "Chose a currency";
    }
    setFormErrors(newFormErrors);
    return Object.values(newFormErrors).length == 0;
  };

  const onSubmit = () => {
    if (validate()) {
      setFormErrors({});
      dispatch(
        createExpense({
          tripId,
          mateId: formData.mateId,
          expense: {
            currency: formData.currency,
            amount: Number(formData.amount),
            evtCreated: getCurrentTimestampSec(),
          },
        })
      );
      navigation.goBack();
    }
  };

  const setFormValue = (name, newValue) => {
    setFormData({ ...formData, [name]: newValue });
    const newFormErrors = { ...formErrors };
    delete newFormErrors[name];
    setFormErrors(newFormErrors);
  };
  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <VStack space={2} px={2} py={3}>
        <FormControl isRequired isInvalid={"amount" in formErrors}>
          <Input
            keyboardType="numeric"
            ref={amountRef}
            autoFocus={true}
            value={formData.amount}
            onChangeText={(val) => setFormValue("amount", val)}
            placeholder="Amount..."
          />
          {"amount" in formErrors ? <FormControl.ErrorMessage>{formErrors["amount"]}</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={"mateId" in formErrors}>
          <Select
            placeholder="Mate..."
            selectedValue={formData?.mateId}
            onValueChange={(val) => setFormValue("mateId", val)}
            _selectedItem={{
              bg: "primary.400",
            }}
          >
            {tripMates.map((mate) => (
              <Select.Item
                label={mate.name}
                value={mate.id}
                key={mate.id}
                _text={{ color: mate.id === formData.mateId ? "white" : "black" }}
              />
            ))}
          </Select>
          {"mateId" in formErrors ? <FormControl.ErrorMessage>{formErrors["mateId"]}</FormControl.ErrorMessage> : null}
        </FormControl>
        <FormControl isRequired isInvalid={"currency" in formErrors}>
          <Select
            placeholder="Currency..."
            selectedValue={formData?.currency}
            onValueChange={(val) => setFormValue("currency", val)}
            _selectedItem={{
              bg: "primary.400",
            }}
          >
            {availableCurrencies.map((currency) => (
              <Select.Item
                label={currency}
                value={currency}
                key={currency}
                _text={{ color: currency === formData.currency ? "white" : "black" }}
              />
            ))}
          </Select>
          {"currency" in formErrors ? <FormControl.ErrorMessage>{formErrors["currency"]}</FormControl.ErrorMessage> : null}
        </FormControl>
        <Button isFullWidth={true} onPress={onSubmit} startIcon={<Icon size="xs" as={<Feather name="save" color="white" />} />}>
          Submit
        </Button>
      </VStack>
    </ScrollView>
  );
}
