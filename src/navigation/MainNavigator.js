import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";

const Stack = createNativeStackNavigator();

export default function MainNavigator({ initialRoute }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* AUTH FLOW */}
      <Stack.Screen name="Auth" component={AuthStack} />

      {/* MAIN APP */}
      <Stack.Screen name="App" component={AppTabs} />

    </Stack.Navigator>
  );
}