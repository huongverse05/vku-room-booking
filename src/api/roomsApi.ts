import { Room } from '../types';
import { VKU_ROOMS } from '../constants/mockData';

export async function fetchRoomsApi(building?: string): Promise<Room[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const query = building && building !== 'Tất cả' ? `?building=${encodeURIComponent(building)}` : '';
    const res = await fetch(`https://api.vku.edu.vn/rooms${query}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return (await res.json()) as Room[];
    }
    throw new Error('API server returned ' + res.status);
  } catch (err) {
    // Graceful fallback to rich local VKU rooms data
    // Simulate slight network latency to show TanStack Query caching & pull-to-refresh
    await new Promise((resolve) => setTimeout(resolve, 350));
    
    if (!building || building === 'Tất cả') {
      return VKU_ROOMS;
    }
    return VKU_ROOMS.filter((room) => room.building === building);
  }
}
