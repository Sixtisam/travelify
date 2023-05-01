import {
  AddIcon,
  Button,
  CheckIcon,
  CloseIcon,
  DeleteIcon,
  HStack,
  Heading,
  IconButton,
  Input,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";

import { useSelector } from "react-redux";
import AmountInput from "./AmountIInput";
import CurrencySelect from "./CurrencySelect";
import MateSelect from "./MateSelect";
import TFormControl from "./TFormControl";
import { getCurrenciesSelector } from "./logic/selectors";
import { roundExchangeRate } from "./logic/util";

const ExpenseForm = forwardRef(({ trip, expense, onSubmit, onDelete }, ref) => {
  const [formErrors, setFormErrors] = useState({});
  const tripMates = useMemo(() => Object.values(trip.mates), [trip.mates]);
  const availableCurrencies = useSelector(getCurrenciesSelector);

  // do not use setFormData0 directly | initial state in useEffect
  const [formData, _setFormData0] = useState({
    shares: {},
  });

  // take over expense from parent component (basically a "form reeset")
  useEffect(() => {
    _setFormData0({ ...expense });
  }, [expense]);

  // auto calc shares for each mate
  const setFormData = useCallback(
    (newState) => {
      if (newState.autoCalc) {
        const sharesKeys = Object.keys(newState.shares);
        const mateCount = sharesKeys.length;
        const avg = roundExchangeRate(newState.amount / (mateCount * 1.0));
        sharesKeys.forEach((mateId) => (newState.shares[mateId] = avg));
      }
      _setFormData0(newState);
    },
    [_setFormData0]
  );

  const updateShare = (mateId, amount = null, autoCalc = true) => {
    const tmp = { ...formData };
    tmp.autoCalc = tmp.autoCalc && autoCalc;
    tmp.shares[mateId] = Number(amount) || 0.0;
    setFormData(tmp);
  };

  const removeShare = (mateId) => {
    const tmp = { ...formData };
    delete tmp.shares[mateId];
    setFormData(tmp);
  };

  const validate = () => {
    const newFormErrors = {};
    const amountAsNr = Number(formData.amount);
    if (isNaN(amountAsNr) || amountAsNr <= 0) {
      newFormErrors["amount"] = "Not a valid number";
    }
    if (formData.title == null || formData.title.trim() === "") {
      newFormErrors["title"] = "Title is empty";
    }
    if (formData.mateId == null) {
      newFormErrors["mateId"] = "Chose a mate";
    }
    if (formData.currency == null) {
      newFormErrors["currency"] = "Chose a currency";
    }
    const sharesSum = Object.values(formData.shares).reduce((a, b) => a + b, 0);
    if (Math.abs(sharesSum - amountAsNr) > 0.00005) {
      newFormErrors["shares"] = "Sum of all shares does not equal amount";
    }
    setFormErrors(newFormErrors);
    return Object.values(newFormErrors).length == 0;
  };

  const _onSubmit = () => {
    if (validate()) {
      setFormErrors({});
      onSubmit(formData);
    }
  };

  useImperativeHandle(ref, () => ({
    submit() {
      _onSubmit();
    },
  }));

  const setFormValue = (name, newValue) => {
    if (name === "amount") {
      newValue = Number(newValue);
    }
    setFormData({ ...formData, [name]: newValue });
    const newFormErrors = { ...formErrors };
    delete newFormErrors[name];
    setFormErrors(newFormErrors);
  };

  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <VStack space={2} px={2} py={3}>
        <TFormControl isRequired formKey="title" formErrors={formErrors}>
          <Input
            autoFocus={true}
            size="lg"
            value={formData.title}
            onChangeText={(val) => setFormValue("title", val)}
            placeholder="Title..."
          />
        </TFormControl>
        <TFormControl isRequired formKey="amount" formErrors={formErrors}>
          <AmountInput value={formData.amount} onChange={(val) => setFormValue("amount", val)} currency={formData.currency} />
        </TFormControl>
        <TFormControl isRequired formKey="mateId" formErrors={formErrors}>
          <MateSelect value={formData?.mateId} onChange={(val) => setFormValue("mateId", val)} availableMates={tripMates} />
        </TFormControl>
        <TFormControl isRequired formKey="currency" formErrors={formErrors}>
          <CurrencySelect
            value={formData?.currency}
            onChange={(val) => setFormValue("currency", val)}
            availableCurrencies={availableCurrencies}
          />
        </TFormControl>
        <Heading fontSize="lg" mt={4} ml={1} borderBottomColor="red">
          Who is involved
        </Heading>
        {"shares" in formErrors ? <Text color="red.500">{formErrors["shares"]}</Text> : null}
        {tripMates.map((mate, idx) => (
          <HStack key={mate.id} alignItems="center" justifyContent="space-between" pb={3} pt={idx === 1 ? 0 : 3} mx={1}>
            <Text fontSize="xl" width="2/5">
              {mate.name}
            </Text>
            {mate.id in formData.shares ? (
              <>
                <Input
                  inputMode="numeric"
                  variant="underlined"
                  selectionColor="red"
                  width="2/6"
                  size="md"
                  textAlign="right"
                  selectTextOnFocus
                  value={((formData.shares[mate.id] || 0.0) * 1.0).toFixed(2) + ""}
                  rightElement={<Text>{formData.currency}</Text>}
                  onChangeText={(val) => updateShare(mate.id, val, false)}
                />
                <IconButton
                  variant="ghost"
                  colorScheme="danger"
                  size="lg"
                  onPress={() => removeShare(mate.id)}
                  icon={<CloseIcon size="xs" />}
                />
              </>
            ) : (
              <Button variant="outline" onPress={() => updateShare(mate.id)} leftIcon={<AddIcon size="xs" />}>
                Add
              </Button>
            )}
          </HStack>
        ))}
        <Button size="lg" isFullWidth={true} onPress={_onSubmit} startIcon={<CheckIcon />}>
          Submit
        </Button>
        {!!onDelete && (
          <Button
            size="sm"
            isFullWidth={true}
            variant="ghost"
            colorScheme="danger"
            onPress={() => onDelete(formData)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        )}
      </VStack>
    </ScrollView>
  );
});
export default ExpenseForm;
