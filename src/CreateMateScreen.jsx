import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Box, Button, CheckIcon, ChevronRightIcon, Divider, FormControl, HStack, Input, Text, VStack } from "native-base";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMateName, createMate } from "./data/store";
import { generateId, getCurrentTimestampSec } from "./logic/util";

import { FlatList } from "react-native";
import MyPressable from "./MyPressable";
import { getMateNameProposalsSelector } from "./logic/selectors";
import NavHeaderButton from "./NavHeaderButtton";

export default function CreateMateScreen() {
  const { tripId } = useRoute().params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const mateNames = useSelector((state) => getMateNameProposalsSelector(state, { tripId }));
  const [mateName, setMateName] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useFocusEffect(
    useCallback(() => {
      setMateName("");
      navigation.setOptions({
        headerRight: () => <NavHeaderButton icon="check" onPress={onFormSubmit} />,
      });
    }, [navigation, setMateName])
  );


  
  const validate = () => {
    const newFormErrors = {};
    if (mateName == null || mateName.trim() === "") {
      newFormErrors["name"] = "Name is mandatory";
    }
    setFormErrors(newFormErrors);
    return Object.values(newFormErrors).length === 0;
  };


  const onCreate = (name) => {
    dispatch(addMateName(name));
    dispatch(
      createMate({
        tripId,
        mate: {
          id: generateId(),
          name: name,
          evtCreated: getCurrentTimestampSec(),
        },
      })
    );
    navigation.goBack();
  };
  const onFormSubmit = () => {
    if (!validate()) {
      return;
    }
    onCreate(mateName);
  };


  return (
    <Box flex={1}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={mateNames}
        keyExtractor={(item) => item}
        renderItem={({ item: name }) => (
          <MyPressable onPress={() => onCreate(name)}>
            <HStack alignItems="center" justifyContent="space-between" p={4}>
              <Text fontSize="xl">{name}</Text>
              <ChevronRightIcon />
            </HStack>
          </MyPressable>
        )}
        ListFooterComponent={
          <>
            <Divider />
            <VStack p={2} space={2}>
              <Text fontSize="md">New</Text>
              <FormControl isRequired isInvalid={"name" in formErrors}>
                <Input size="md" placeholder="Name" value={mateName} onChangeText={(text) => setMateName(text)} />
                {"name" in formErrors ? <FormControl.ErrorMessage>{formErrors["name"]}</FormControl.ErrorMessage> : null}
              </FormControl>
              <Button onPress={() => onFormSubmit(mateName)} startIcon={<CheckIcon />}>
                Create mate
              </Button>
            </VStack>
          </>
        }
      />
    </Box>
  );
}
