import { Select } from "native-base";
import React from "react";

export default function MateSelect({ value, onChange, availableMates }) {
  return (
    <Select
      placeholder="Who paid..."
      size="lg"
      selectedValue={value}
      onValueChange={onChange}
      selectionColor="white"
      _selectedItem={{
        bg: "primary.400",
        _text: {
          color: "white",
        },
      }}
    >
      {availableMates.map((mate) => (
        <Select.Item label={mate.name} value={mate.id} key={mate.id} />
      ))}
    </Select>
  );
}
