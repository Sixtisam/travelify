import { Select } from "native-base";
import React from "react";

export default function CurrencySelect({ value, onChange, availableCurrencies }) {
  return (
    <Select
      placeholder="Currency..."
      selectedValue={value}
      size="lg"
      onValueChange={onChange}
      selectionColor="white"
      _selectedItem={{
        bg: "primary.400",
        _text: {
          color: "white",
        },
      }}
    >
      {availableCurrencies.map((currency) => (
        <Select.Item label={currency} value={currency} key={currency} />
      ))}
    </Select>
  );
}
