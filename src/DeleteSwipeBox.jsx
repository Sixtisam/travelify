import { DeleteIcon, HStack, useToken } from "native-base";

import React from "react";
import MyPressable from "./MyPressable";

export default function DeleteSwipeBox({ onPress, padding }) {
  const [redColor] = useToken("colors", ["red.500"]);
  return (
    <HStack flex={1} justifyContent="flex-end" alignItems="stretch">
      <MyPressable alignItems="center" backgroundColor={redColor} padding={padding} justifyContent="center" onPress={onPress}>
        <DeleteIcon size="md" color="white" />
      </MyPressable>
    </HStack>
  );
}
