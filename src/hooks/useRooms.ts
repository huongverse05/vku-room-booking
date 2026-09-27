import { useQuery } from '@tanstack/react-query';
import { fetchRoomsApi } from '../api/roomsApi';
import { Room } from '../types';

export function useRooms(building?: string) {
  return useQuery<Room[]>({
    queryKey: ['rooms', { building }], // Cache key as specified in slide 17
    queryFn: async () => {
      return fetchRoomsApi(building);
    },
  });
}
