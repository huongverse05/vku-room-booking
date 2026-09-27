import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// 1. Define all routes and their param shapes (Slide 6)
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  RoomDetails: { roomId: string; roomName: string };
  BookingConfirmation: { bookingId: string };
};

export type TabParamList = {
  BrowseRooms: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

// 2. Generate typed props for each screen (Slide 6)
export type RoomDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'RoomDetails'
>;

export type BookingConfirmationProps = NativeStackScreenProps<
  RootStackParamList,
  'BookingConfirmation'
>;

export type BrowseRoomsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'BrowseRooms'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MyBookingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'MyBookings'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;
