import { generateMockOrders } from './mock-data';

export const localOrdersCache: any[] = [];

export function ensureMockOrders() {
  if (localOrdersCache.length === 0) {
    localOrdersCache.push(...generateMockOrders());
  }
}
