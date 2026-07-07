import { prisma, runWithDatabaseFallback } from './prisma';
import { mockNotifications } from './mock-data';

export const localNotificationsCache: Array<{
  id: string;
  tenantId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}> = mockNotifications.map((n) => ({ ...n }));

export async function createNotification(
  tenantId: string,
  type: string,
  message: string
) {
  return runWithDatabaseFallback(
    async () => {
      return prisma.notification.create({
        data: { tenantId, type, message },
      });
    },
    async () => {
      const notif = {
        id: `mock-notif-${Date.now()}`,
        tenantId,
        type,
        message,
        read: false,
        createdAt: new Date().toISOString(),
      };
      localNotificationsCache.unshift(notif);
      return notif;
    }
  );
}

export async function listNotifications(tenantId: string) {
  return runWithDatabaseFallback(
    async () => {
      return prisma.notification.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    },
    async () => localNotificationsCache.filter((n) => n.tenantId === tenantId)
  );
}

export async function markNotificationsRead(tenantId: string, ids?: string[]) {
  return runWithDatabaseFallback(
    async () => {
      if (ids?.length) {
        await prisma.notification.updateMany({
          where: { tenantId, id: { in: ids } },
          data: { read: true },
        });
      } else {
        await prisma.notification.updateMany({
          where: { tenantId, read: false },
          data: { read: true },
        });
      }
    },
    async () => {
      localNotificationsCache.forEach((n) => {
        if (n.tenantId === tenantId && (!ids?.length || ids.includes(n.id))) {
          n.read = true;
        }
      });
    }
  );
}
