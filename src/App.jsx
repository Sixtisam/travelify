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
import { HStack, NativeBaseProvider, Spinner } from "native-base";
import React, { useEffect, useState } from "react";
import { Linking, StatusBar } from "react-native";
import { persistor, store } from "./data/store";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AboutScreen from "./AboutScreen";
import CoreStackNavigator from "./CoreStackNavigator";
import NavDrawerContent from "./NavDrawerContent";
import SettingsScreen from "./SettingsScreen";
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
      <StatusBar backgroundColor={theme.colors.primary["500"]} barStyle="light-content" />
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
                  headerTintColor: navTheme.colors.background,
                  headerStyle: { backgroundColor: navTheme.colors.primary },
                  headerTitleStyle: {
                    fontFamily: "Inter_600SemiBold",
                  },
                }}
                drawerContent={(props) => <NavDrawerContent {...props} />}
              >
                <Drawer.Screen name="Core" component={CoreStackNavigator} />
                <Drawer.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{ headerShown: true, headerBackgroundContainerStyle: { backgroundColor: theme.colors.primary[500] } }}
                />
                <Drawer.Screen name="About" component={AboutScreen} />
              </Drawer.Navigator>
            </NavigationContainer>
          )}
        </PersistGate>
      </ReduxProvider>
    </NativeBaseProvider>
  );
}
