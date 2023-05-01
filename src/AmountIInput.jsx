import { Input, InputGroup, InputRightAddon, Text } from "native-base";

export default function AmountInput({ value, onChange, currency }) {
  return (
    <InputGroup>
      <Input flex={1} inputMode="numeric" selectTextOnFocus selectionColor="red.500" size="lg" value={value + ""} onChangeText={onChange} placeholder="Amount..." />
      <InputRightAddon>
        <Text>{currency}</Text>
      </InputRightAddon>
    </InputGroup>
  );
}
