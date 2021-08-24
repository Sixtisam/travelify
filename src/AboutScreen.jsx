import * as licenses from "./licenses.json";

import { Box, Divider, Flex, HStack, Heading, Image, Link, Text, VStack, useToken } from "native-base";
import { FlatList, Linking, ScrollView } from "react-native";

import Constants from "expo-constants";
import MyPressable from "./MyPressable";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { boxShadow } from "styled-system";

const transformedLicenses = Object.entries(licenses).map(([name, infos]) => {
  const lastAtIndex = name.lastIndexOf("@");
  return {
    name: name.substring(0, lastAtIndex),
    repoUrl: infos.repository,
  };
});

export default function AboutScreen() {
  const aboveList = (
    <VStack divider={<Divider />}>
      <VStack mb={4}>
        <Box px={8} py={10} bg="primary.500">
          <Image
            alt="Travelify"
            style={{ width: "100%", height: undefined, aspectRatio: 800 / 293, resizeMode: "contain" }}
            source={require("../assets/nav_header.png")}
          />
        </Box>
        <Text fontSize="sm" mx="auto" my={3}>
          Version {Constants.manifest.version}
        </Text>
        <Text mx="auto" fontSize="lg">
          &copy; by Samuel Keusch 2021
        </Text>
      </VStack>
      <VStack space={1} alignItems="center" marginBottom={4} alignItems="flex-start">
        <Heading size="lg" my={4} mx="auto">
          Credits
        </Heading>
        <HStack p={2} flexWrap="wrap" alignItems="center">
          <Text fontSize="sm">Travelify logo font: </Text>
          <Link isUnderlined href="https://hanken.co/product/hk-grotesk/" isExternal>
            HKGrotesk-Bold
          </Link>
          <Text fontSize="sm">, designed by</Text>
          <Link isUnderlined href="https://hanken.co/" isExternal>
            Hanken Design Co.
          </Link>
          <Text fontSize="sm"> and licensed under </Text>
          <Link isUnderlined href="http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL_web" isExternal>
            Open Font License
          </Link>
        </HStack>
        <HStack p={2} flexWrap="wrap" alignItems="center">
          <Text fontSize="sm">Travelify icon designed by: </Text>
          <Link isUnderlined href="https://thenounproject.com/Kinger" isExternal>
            Ben King
          </Link>
        </HStack>
        <HStack p={2} flexWrap="wrap" alignItems="center">
          <Text fontSize="sm">App font: </Text>
          <Link href="https://rsms.me/inter/" isExternal isUnderlined>
            Inter
          </Link>
        </HStack>
        <HStack p={2} flexWrap="wrap" alignItems="center">
          <Text fontSize="sm">App icons: </Text>
          <Link href="https://feathericons.com/" isExternal isUnderlined>
            Feather
          </Link>
        </HStack>
      </VStack>

      <Heading size="lg" mx="auto" my={4}>
        Used Software
      </Heading>
    </VStack>
  );

  return (
    <FlatList
      data={transformedLicenses}
      keyExtractor={(_, index) => index + ""}
      renderItem={({ item }) => (
        <Link my={4} mx={2} href={item.repoUrl} isExternal isUnderlined>
          {item.name}
        </Link>
      )}
      ListHeaderComponent={aboveList}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
}
