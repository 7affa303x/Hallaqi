import {
  deletePushSubscription,
  upsertPushSubscription,
} from '@/supabase/database';

function applicationServerKey(value: string): ArrayBuffer {
  const padding = '='.repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
  return bytes.buffer;
}

export function isWebPushSupported(): boolean {
  return 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'Notification' in window;
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!isWebPushSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function enableWebPush(userId: string): Promise<PushSubscription> {
  if (!isWebPushSupported()) throw new Error('الإشعارات الفورية غير مدعومة على هذا الجهاز');
  const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY?.trim();
  if (!publicKey) throw new Error('مفتاح الإشعارات العام غير مضبوط');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('يجب السماح بالإشعارات من إعدادات المتصفح');

  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  const subscription = existing || await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey(publicKey),
  });
  await upsertPushSubscription(userId, subscription.toJSON());
  return subscription;
}

export async function disableWebPush(): Promise<void> {
  const subscription = await getPushSubscription();
  if (!subscription) return;
  await deletePushSubscription(subscription.endpoint);
  await subscription.unsubscribe();
}
