import { Divider, HStack, Heading, Icon, Text, VStack, useToken } from "native-base";

import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import MyPressable from "./MyPressable";
import React from "react";

export function NavEntry({ label, target, navigation, icon, currRouteName }) {
  const isFocused = currRouteName === target;
  return (
    <MyPressable
      onPress={() => {
        navigation.navigate(target);
      }}
    >
      <HStack space={7} alignItems="center" bg={isFocused ? "primary.400" : "transparent"} px={5} py={3}>
        <Icon color={isFocused ? "white" : "gray.500"} size={5} as={<Feather name={icon} size={24} color="black" />} />
        <Text fontWeight={500} color={isFocused ? "white" : "gray.700"}>
          {label}
        </Text>
      </HStack>
    </MyPressable>
  );
}

export default function NavDrawerContent(props) {
  const [primColor] = useToken("colors", ["primary.500"]);
  const currRouteName = props.state?.routes[props.state.index]?.name;

  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack>
        <HStack px={2} py={6} justifyContent="center">
          <Heading size="2xl" color={primColor}>
            Travelify
          </Heading>
        </HStack>
        <VStack divider={<Divider />}>
          <VStack space={3}>
            <NavEntry target="Core" label="Home" icon="home" navigation={props.navigation} currRouteName={currRouteName} />
            <NavEntry target="Settings" label="Settings" icon="settings" navigation={props.navigation} currRouteName={currRouteName} />
            <NavEntry target="About" label="About" icon="info" navigation={props.navigation} currRouteName={currRouteName} />
          </VStack>
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}
