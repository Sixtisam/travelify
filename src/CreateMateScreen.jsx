import { Box, Button, Divider, FormControl, HStack, Icon, Input, Text, VStack } from "native-base";
import React, { useCallback, useState } from "react";
import { addMateName, createMate } from "./data/store";
import { generateId, getCurrentTimestampSec } from "./logic/util";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import { Feather } from "@expo/vector-icons";
import { FlatList } from "react-native";
import MyPressable from "./MyPressable";
import { getMateNameProposalsSelector } from "./logic/selectors";

export default function CreateMateScreen() {
  const { tripId } = useRoute().params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const mateNames = useSelector((state) => getMateNameProposalsSelector(state, { tripId }));
  const [mateName, setMateName] = useState("");

  useFocusEffect(
    useCallback(() => {
      setMateName("");
    }, [])
  );
  const [formErrors, setFormErrors] = useState({});
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
          expenses: [],
        },
      })
    );
    // setMateName("");
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
        data={mateNames}
        keyExtractor={(item) => item}
        renderItem={({ item: name }) => (
          <MyPressable onPress={() => onCreate(name)}>
            <HStack alignItems="center" justifyContent="space-between" p={4}>
              <Text fontSize="xl">{name}</Text>
              <Icon size="sm" as={<Feather name="chevron-right" size={24} color="black" />} />
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
                {"name" in formErrors ? (
                  <FormControl.ErrorMessage
                    _text={{
                      fontSize: "xs",
                      color: "error.500",
                      fontWeight: 500,
                    }}
                  >
                    {formErrors["name"]}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>
              <Button
                onPress={() => onFormSubmit(mateName)}
                startIcon={<Icon size="sm" as={<Feather name="save" size={24} color="black" />} />}
              >
                Create mate
              </Button>
            </VStack>
          </>
        }
      />
    </Box>
  );
}
