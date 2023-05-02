import { useNavigation, useRoute } from "@react-navigation/native";
import { AlertDialog, Button } from "native-base";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteMate } from "./data/store";
import { useTotalMateConsumption, useTotalMateExpenses } from "./logic/hooks";
import { getTripSelector } from "./logic/selectors";

export default function DeleteMateAlert({ tripId, mate, show, hide }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const trip = useSelector((state) => getTripSelector(state, { tripId }));
  const totalMateConsumption = useTotalMateConsumption(mate, trip);
  const totalMateExpenses = useTotalMateExpenses(mate, trip);
  const deletable = totalMateConsumption == 0.0 && totalMateExpenses == 0.0;

  const onDelete = () => {
    hide();
    dispatch(deleteMate({ tripId, mateId: mate.id }));
    if (route.name === "MateDetail") {
      navigation.goBack();
    }
  };

  return (
    <AlertDialog isOpen={show} onClose={hide} motionPreset={"fade"}>
      <AlertDialog.Content>
        <AlertDialog.Header fontSize="lg" fontWeight="bold">
          {"Delete " + (mate?.name || "mate")}
        </AlertDialog.Header>
        {deletable ? (
          <AlertDialog.Body>Are you sure? You can't undo this action afterwards.</AlertDialog.Body>
        ) : (
          <AlertDialog.Body>{"You cannot delete " + (mate?.name || "mate") + " as he still have expenses and/or consumptions."}</AlertDialog.Body>
        )}
        <AlertDialog.Footer>
          <Button onPress={hide}>Cancel</Button>
          <Button isDisabled={!deletable} colorScheme="red" onPress={onDelete} ml={3} _text={{ color: "white" }}>
            Delete
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
