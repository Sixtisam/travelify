import { HStack, Icon, useToken } from "native-base";

import { Feather } from "@expo/vector-icons";
import MyPressable from "./MyPressable";
import React from "react";

export default function DeleteSwipeBox({ onPress, padding }) {
  const [redColor] = useToken("colors", ["red.500"]);
  return (
    <HStack flex={1} justifyContent="flex-end" alignItems="stretch">
      <MyPressable alignItems="center" backgroundColor={redColor} padding={padding} justifyContent="center" onPress={onPress}>
        <Icon size="md" as={<Feather name="trash-2" />} color="white" />
      </MyPressable>
    </HStack>
  );
}
