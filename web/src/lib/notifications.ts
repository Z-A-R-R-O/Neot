import { prisma } from "@/lib/db";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  link?: string,
) {
  return prisma.notification.create({
    data: { userId, type, title, message, link },
  });
}

export async function getUserNotifications(userId: string, limit = 20) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, readAt: null },
  });
}

export async function markNotificationRead(id: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { readAt: new Date() },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
