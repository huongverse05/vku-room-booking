import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabNavigator } from './MainTabNavigator';
import { RoomDetailsScreen } from '../screens/RoomDetailsScreen';
import { BookingConfirmationScreen } from '../screens/BookingConfirmationScreen';

// Slide 7: Stack Navigator Implementation with typed param list
const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerStyle: { backgroundColor: '#1E3A5F' }, // Slide 7
        headerTintColor: '#fff',                      // Slide 7
        animation: 'slide_from_right',                // Slide 7
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RoomDetails"
        component={RoomDetailsScreen}
        options={({ route }) => ({ title: route.params.roomName })} // Slide 7
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
        options={{
          presentation: 'modal', // Slide 7 & 9
          title: 'Thẻ Ra Vào Phòng VKU',
          headerBackTitle: 'Đóng',
        }}
      />
    </Stack.Navigator>
  );
}
