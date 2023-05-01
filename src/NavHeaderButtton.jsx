import { Feather } from "@expo/vector-icons";
import { Icon, IconButton } from "native-base";
import React from "react";

export default function NavHeaderButton({ icon, onPress, size = "md", ...props }) {
  if (typeof icon === "string") {
    return <IconButton {...props} variant="ghost" icon={<Icon size={size} color="white" name={icon} as={Feather} />} onPress={onPress} />;
  } else {
    return <IconButton {...props} variant="ghost" icon={React.createElement(icon, { color: "white" })} onPress={onPress} />;
  }
}
