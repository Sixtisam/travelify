import { ChevronRightIcon, HStack, Heading } from "native-base";
import React from "react";

export default function NavBreadcrumb({ first, second }) {
  return (
    <HStack alignItems="center">
      <Heading color="white" fontSize="lg">
        {first}
      </Heading>
      <ChevronRightIcon mx={2} size="sm" color="white" />
      <Heading color="white" fontSize="lg">
        {second}
      </Heading>
    </HStack>
  );
}
