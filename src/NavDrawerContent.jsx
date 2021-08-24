import { Box, Divider, HStack, Heading, Icon, Text, VStack, useToken } from "native-base";

import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import { Image } from "react-native";
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
      <HStack space={7} alignItems="center" bg={isFocused ? "primary.500" : "transparent"} px={5} py={3}>
        <Icon color={isFocused ? "white" : "gray.500"} size={5} as={<Feather name={icon} size={24} color="black" />} />
        <Text fontWeight={500} color={isFocused ? "white" : "gray.700"}>
          {label}
        </Text>
      </HStack>
    </MyPressable>
  );
}

export default function NavDrawerContent(props) {
  const currRouteName = props.state?.routes[props.state.index]?.name;

  return (
    <DrawerContentScrollView {...props} safeArea style={{ padding: 0 }}>
      <VStack marginTop={-1}>
        <Box p={4} bg="primary.500">
          <Image
            alt="Travelify"
            style={{ width: "100%", height: undefined, aspectRatio: 800 / 293, resizeMode: "contain" }}
            source={require("../assets/nav_header.png")}
          />
        </Box>
        <VStack space={3} mt={3}>
          <NavEntry target="Core" label="Home" icon="home" navigation={props.navigation} currRouteName={currRouteName} />
          <NavEntry target="Settings" label="Settings" icon="settings" navigation={props.navigation} currRouteName={currRouteName} />
          <NavEntry target="About" label="About" icon="info" navigation={props.navigation} currRouteName={currRouteName} />
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}
