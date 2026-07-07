import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/api-auth';
import {
  createNotification,
  listNotifications,
  markNotificationsRead,
} from '@/lib/notifications';

export async function GET(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const notifications = await listNotifications(session!.tenantId);
    return NextResponse.json(notifications);
  } catch (err) {
    console.error('Fetch notifications error:', err);
    return NextResponse.json({ error: 'Failed to load notifications.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const body = await request.json().catch(() => ({}));
    const ids = body.ids as string[] | undefined;

    await markNotificationsRead(session!.tenantId, ids);
    const notifications = await listNotifications(session!.tenantId);
    return NextResponse.json({ success: true, notifications });
  } catch (err) {
    console.error('Update notifications error:', err);
    return NextResponse.json({ error: 'Failed to update notifications.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { error, session } = await authenticateRequest(request);
    if (error) return error;

    const body = await request.json();
    const { type, message } = body;
    if (!type || !message) {
      return NextResponse.json({ error: 'type and message required.' }, { status: 400 });
    }

    const notif = await createNotification(session!.tenantId, type, message);
    return NextResponse.json(notif);
  } catch (err) {
    console.error('Create notification error:', err);
    return NextResponse.json({ error: 'Failed to create notification.' }, { status: 500 });
  }
}
