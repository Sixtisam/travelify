import { usePropsResolution, useToken } from "native-base";

import { Pressable } from "react-native";
import React from "react";

export default function MyPressable(props) {
  const resolProps = usePropsResolution("Box", props);
  const [rippleBg] = useToken("colors", ["bluegray.300"]);
  return <Pressable android_ripple={{ color: rippleBg }} {...resolProps} {...props} />;
}
