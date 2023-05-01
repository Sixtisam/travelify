import {
  AddIcon,
  Button,
  Divider,
  FormControl,
  HStack,
  HamburgerIcon,
  Heading,
  IconButton,
  Input,
  Modal,
  Text,
  useDisclose,
} from "native-base";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCurrency, addMateName, deleteCurrency, deleteMateName } from "./data/store";
import { getCurrenciesSelector, getMateNamesSelector } from "./logic/selectors";

import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeListView } from "react-native-swipe-list-view";
import DeleteSwipeBox from "./DeleteSwipeBox";
import NavHeaderButton from "./NavHeaderButtton";

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
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

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <></>,
      headerRight: () => <NavHeaderButton icon={HamburgerIcon} mr={4} onPress={() => navigation.openDrawer()} />,
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl" avoidKeyboard justifyContent="center">
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
            <IconButton mr={3} variant="solid" size="md" onPress={() => onChoseAddItem(section)} icon={<AddIcon size="sm" />} />
          </HStack>
        )}
        ItemSeparatorComponent={() => <Divider />}
        previewRowKey={"0"}
        rightOpenValue={-70}
        previewOpenValue={-70}
        previewOpenDelay={500}
        disableRightSwipe={true}
      />
    </SafeAreaView>
  );
}
