import Constants from "expo-constants";
import { Box, Divider, Heading, HStack, Text, useToken } from "native-base";
import React from "react";
import { FlatList, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as licenses from "./licenses.json";
import MyPressable from "./MyPressable";

const transformedLicenses = Object.entries(licenses).map(([name, infos]) => {
  const lastAtIndex = name.lastIndexOf("@");
  return {
    name: name.substring(0, lastAtIndex),
    repoUrl: infos.repository,
  };
});

export default function AboutScreen() {
  const [primColor] = useToken("colors", ["primary.500"]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box my={10}>
        <Heading mx="auto" my={0} size="4xl" color={primColor}>
          Travelify
        </Heading>
        <Text fontSize="sm" mx="auto" my={3}>
          Version {Constants.manifest.version}
        </Text>
        <Text mx="auto" fontSize="lg">
          &copy; by Samuel Keusch 2021
        </Text>
      </Box>
      <Heading size="lg" mx="auto">
        Used Software
      </Heading>
      <FlatList
        data={transformedLicenses}
        keyExtractor={(_, index) => index + ""}
        renderItem={({ item }) => (
          <MyPressable onPress={() => Linking.openURL(item.repoUrl)}>
            <HStack p={4} justifyContent="space-between">
              <Text isTruncated={true} fontSize="sm">
                {item.name}
              </Text>
            </HStack>
          </MyPressable>
        )}
        ItemSeparatorComponent={() => <Divider />}
      />
    </SafeAreaView>
  );
}
