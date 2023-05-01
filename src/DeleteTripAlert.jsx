import { useNavigation, useRoute } from "@react-navigation/native";
import { AlertDialog, Button } from "native-base";
import React from "react";
import { useDispatch } from "react-redux";
import { deleteTrip } from "./data/store";

export default function DeleteTripAlert({ tripId, show, hide }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const onDeleteTrip = () => {
    hide();
    dispatch(deleteTrip({ tripId }));
    if (route.name === "TripDetail") {
      navigation.goBack();
    }
  };

  return (
    <AlertDialog isOpen={show} onClose={hide} motionPreset={"fade"}>
      <AlertDialog.Content>
        <AlertDialog.Header fontSize="lg" fontWeight="bold">
          Delete trip
        </AlertDialog.Header>
        <AlertDialog.Body>Are you sure? You can't undo this action afterwards.</AlertDialog.Body>
        <AlertDialog.Footer>
          <Button onPress={hide}>Cancel</Button>
          <Button colorScheme="red" onPress={onDeleteTrip} ml={3} _text={{ color: "white" }}>
            Delete
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
