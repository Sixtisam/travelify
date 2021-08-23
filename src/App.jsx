import { HStack, NativeBaseProvider, Spinner } from "native-base";
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import React, { useEffect, useState } from "react";
import { persistor, store } from "./data/store";

import AboutScreen from "./AboutScreen";
import AppLoading from "expo-app-loading";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CoreStackNavigator from "./CoreStackNavigator";
import { Linking } from "react-native";
import NavDrawerContent from "./NavDrawerContent";
import { NavigationContainer } from "@react-navigation/native";
import { PersistGate } from "redux-persist/integration/react";
import { Provider as ReduxProvider } from "react-redux";
import SettingsScreen from "./SettingsScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import navTheme from "./nav-theme";
import theme from "./theme";

const Drawer = createDrawerNavigator();

const NAV_PERSISTENCE_KEY = "react_navigation_state";

export default function App() {
  const [initialState, setInitialState] = useState();
  const [isNavReady, setIsNavReady] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  useEffect(() => {
    const restoreNavState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== "web" && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(NAV_PERSISTENCE_KEY);
          const state = savedStateString ? JSON.parse(savedStateString) : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsNavReady(true);
      }
    };

    if (!isNavReady) {
      restoreNavState();
    }
  }, [isNavReady]);

  const onNavStateChange = (state) => {
    AsyncStorage.setItem(NAV_PERSISTENCE_KEY, JSON.stringify(state)).then();
  };

  return (
    <NativeBaseProvider theme={theme}>
      <ReduxProvider store={store}>
        <PersistGate loading={<AppLoading />} persistor={persistor}>
          {!(fontsLoaded && isNavReady) ? (
            <HStack alignItems="center" justifyContent="center" height="100%" width="100%">
              <Spinner size="large" />
            </HStack>
          ) : (
            <NavigationContainer theme={navTheme} initialState={initialState} onStateChange={onNavStateChange}>
              <Drawer.Navigator
                initialRouteName="Core"
                screenOptions={{
                  headerShown: false,
                  detachInactiveScreens: true,
                }}
                drawerContent={(props) => <NavDrawerContent {...props} />}
              >
                <Drawer.Screen name="Core" component={CoreStackNavigator} />
                <Drawer.Screen name="Settings" component={SettingsScreen} />
                <Drawer.Screen name="About" component={AboutScreen} />
              </Drawer.Navigator>
            </NavigationContainer>
          )}
        </PersistGate>
      </ReduxProvider>
    </NativeBaseProvider>
  );
}
