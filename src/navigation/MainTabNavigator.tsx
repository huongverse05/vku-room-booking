import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TabParamList } from './types';
import { BrowseRoomsScreen } from '../screens/BrowseRoomsScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

// Slide 8: Create Bottom Tab Navigator
const Tab = createBottomTabNavigator<TabParamList>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            BrowseRooms: focused ? 'search' : 'search-outline',
            MyBookings: focused ? 'calendar' : 'calendar-outline',
            Profile: focused ? 'person' : 'person-outline',
          } as const;

          return (
            <Ionicons
              name={icons[route.name]}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#3B82F6', // Slide 8
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="BrowseRooms"
        component={BrowseRoomsScreen}
        options={{ title: 'Khám phá' }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ title: 'Lịch đặt phòng' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Cá nhân' }}
      />
    </Tab.Navigator>
  );
}
