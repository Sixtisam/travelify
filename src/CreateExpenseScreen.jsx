import { Button, FormControl, Icon, Input, Select, VStack } from "native-base";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import { Feather } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { createExpense } from "./data/store";
import { getCurrentTimestampSec } from "./logic/util";
import { getTripSelector } from "./logic/selectors";

export default function CreateExpenseScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tripId, mateId } = useRoute().params;
  const availableCurrencies = useSelector((state) => state.config.currencies);
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
    <ScrollView style={{ flex: 1 }}>
      <VStack space={2} px={2} py={3}>
        <FormControl isRequired isInvalid={"amount" in formErrors}>
          <Input
            ref={amountRef}
            autoFocus={true}
            value={formData.amount}
            onChangeText={(val) => setFormValue("amount", val)}
            placeholder="Amount..."
          />
          {"amount" in formErrors ? (
            <FormControl.ErrorMessage _text={{ fontSize: "xs", color: "error.500", fontWeight: 500 }}>
              {formErrors["amount"]}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <FormControl isRequired isInvalid={"mateId" in formErrors}>
          <Select
            placeholder="Mate..."
            selectedValue={formData?.mateId}
            style={{ margin: 6 }}
            onValueChange={(val) => setFormValue("mateId", val)}
            _selectedItem={{
              bg: "cyan.600",
              endIcon: <Feather name="check" size={24} color="white" />,
            }}
          >
            {tripMates.map((mate) => (
              <Select.Item label={mate.name} value={mate.id} key={mate.id} />
            ))}
          </Select>
          {"mateId" in formErrors ? (
            <FormControl.ErrorMessage _text={{ fontSize: "xs", color: "error.500", fontWeight: 500 }}>
              {formErrors["mateId"]}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <FormControl isRequired isInvalid={"currency" in formErrors}>
          <Select
            placeholder="Currency..."
            selectedValue={formData?.currency}
            style={{ margin: 6 }}
            onValueChange={(val) => setFormValue("currency", val)}
            _selectedItem={{
              bg: "primary.500",
              endIcon: <Feather name="check" size={24} color="white" />,
            }}
          >
            {availableCurrencies.map((currency) => (
              <Select.Item label={currency} value={currency} key={currency} />
            ))}
          </Select>
          {"currency" in formErrors ? (
            <FormControl.ErrorMessage _text={{ fontSize: "xs", color: "error.500", fontWeight: 500 }}>
              {formErrors["currency"]}
            </FormControl.ErrorMessage>
          ) : null}
        </FormControl>
        <Button isFullWidth={true} onPress={onSubmit} startIcon={<Icon size="xs" as={<Feather name="save" color="white" />} />}>
          Submit
        </Button>
      </VStack>
    </ScrollView>
  );
}
