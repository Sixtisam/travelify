import {
  Button,
  Divider,
  FormControl,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  Modal,
  Text,
  VStack,
  useDisclose,
  useScreenReaderEnabled,
} from "native-base";
import React, { useMemo, useRef, useState } from "react";
import { addCurrency, addMateName, deleteCurrency, deleteMateName } from "./data/store";
import { getCurrenciesSelector, getMateNamesSelector } from "./logic/selectors";
import { useDispatch, useSelector } from "react-redux";

import DeleteSwipeBox from "./DeleteSwipeBox";
import { Feather } from "@expo/vector-icons";
import { SwipeListView } from "react-native-swipe-list-view";

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const mateNames = useSelector(getMateNamesSelector);
  const currencies = useSelector(getCurrenciesSelector);
  const listData = useMemo(() => {
    return [
      { id: "mateNames", title: "Mate names", singular: "Mate Name", data: mateNames },
      { id: "currencies", title: "Currencies", singular: "Currency", data: currencies },
    ];
  }, [mateNames, currencies]);

  const [newValue, setNewValue] = useState("");
  const [modalSection, setModalSection] = useState(null);
  const [valueError, setValueError] = useState(null);
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclose();
  const inputRef = useRef();

  const onDeleteItem = (section, item) => {
    if (section.id === "mateNames") {
      dispatch(deleteMateName(item));
    } else if (section.id === "currencies") {
      dispatch(deleteCurrency(item));
    }
  };

  const onChoseAddItem = (section) => {
    setModalSection(section);
    setNewValue(null);
    openModal();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const onCreateItem = () => {
    if (newValue == null || newValue.trim() === "") {
      setValueError("Missing value");
      return;
    }
    if (modalSection.id === "mateNames") {
      dispatch(addMateName(newValue));
    } else if (modalSection.id === "currencies") {
      dispatch(addCurrency(newValue));
    }
    closeModal();
    setValueError(null);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal} size="full" avoidKeyboard justifyContent="flex-start">
        <Modal.Content borderRadius={0}>
          <Modal.CloseButton />
          <Modal.Header>
            <Heading fontSize="xl">New {modalSection?.singular}</Heading>
          </Modal.Header>
          <Modal.Body>
            <FormControl isRequired isInvalid={!!valueError}>
              <Input
                ref={inputRef}
                size="md"
                placeholder={modalSection?.singular + "..."}
                value={newValue}
                onChangeText={(text) => (modalSection.id === "currencies" ? setNewValue(text.toUpperCase()) : setNewValue(text))}
              />
              {!!valueError ? <FormControl.ErrorMessage>{valueError}</FormControl.ErrorMessage> : null}
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group variant="ghost" space={2}>
              <Button colorScheme="error" onPress={closeModal}>
                Cancel
              </Button>
              <Button onPress={onCreateItem}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <SwipeListView
        sections={listData}
        keyExtractor={(item) => item}
        useSectionList={true}
        renderItem={({ item }) => (
          <HStack px={2} py={4} bg="white">
            <Text fontSize="md">{item}</Text>
          </HStack>
        )}
        stickySectionHeadersEnabled={true}
        renderHiddenItem={({ item, section }, _) => <DeleteSwipeBox onPress={() => onDeleteItem(section, item)} padding={15} />}
        SectionSeparatorComponent={() => <Divider mt={2} height={2} />}
        renderSectionHeader={({ section }) => (
          <HStack px={2} py={4} pt={6} alignItems="center" justifyContent="space-between" bg="white">
            <Heading fontSize="2xl">{section.title}</Heading>
            <IconButton
              variant="solid"
              size="md"
              onPress={() => onChoseAddItem(section)}
              icon={<Icon size="md" color="white" as={<Feather name="plus" />} />}
            />
          </HStack>
        )}
        ItemSeparatorComponent={() => <Divider />}
        ListHeaderComponent={
          <VStack px={2} py={4} alignItems="flex-start">
            <Heading size="2xl">Settings</Heading>
            <Divider />
          </VStack>
        }
        previewRowKey={"0"}
        rightOpenValue={-70}
        previewOpenValue={-70}
        previewOpenDelay={500}
        disableRightSwipe={true}
      />
    </>
  );
}
