import CreateExpenseScreen from "./CreateExpenseScreen";
import CreateMateScreen from "./CreateMateScreen";
import CreateTripScreen from "./CreateTripScreen";
import ExchangeRatesTripScreen from "./ExchangeRatesTripScreen";
import MateDetailScreen from "./MateDetailScreen";
import React from "react";
import TripDetailScreen from "./TripDetailScreen";
import TripListScreen from "./TripListScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme as useNavTheme } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function CoreStackNavigator() {
  const navTheme = useNavTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: navTheme.colors.background,
        headerStyle: { backgroundColor: navTheme.colors.primary },
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold",
        },
      }}
    >
      <Stack.Screen name="Home" options={{ title: "My Trips" }} component={TripListScreen} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="MateDetail" component={MateDetailScreen} />
      <Stack.Screen name="CreateMate" options={{ title: "New Mate" }} component={CreateMateScreen} />
      <Stack.Screen name="CreateTrip" options={{ title: "New Trip" }} component={CreateTripScreen} />
      <Stack.Screen name="CreateExpense" options={{ title: "New Expense" }} component={CreateExpenseScreen} />
      <Stack.Screen name="ExchangeRatesTrip" component={ExchangeRatesTripScreen} />
    </Stack.Navigator>
  );
}
