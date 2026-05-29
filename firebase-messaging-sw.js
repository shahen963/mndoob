// ============================================================
// firebase-messaging-sw.js
// يُرفع على نفس دومين الموقع في المجلد الجذر /
// مثال: https://yoursite.com/firebase-messaging-sw.js
// مطلوب للـ Push Notifications في المتصفحات (PWA fallback)
// ملاحظة: للـ APK عبر WebView — الـ Native Firebase SDK يتولى هذا
// ============================================================

// ─── إعدادات Firebase — مطابقة لـ google-services.json ──────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyA1ekna7xnbdu-Mqo34ik9scLa41Bd1A3E",
  authDomain:        "shaheen-5a1bc.firebaseapp.com",
  projectId:         "shaheen-5a1bc",
  storageBucket:     "shaheen-5a1bc.firebasestorage.app",
  messagingSenderId: "8978921835",
  appId:             "1:8978921835:android:054356346cf8604b4df42e"
};

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp(FIREBASE_CONFIG);
const messaging = firebase.messaging();

// ─── استقبال الإشعارات في الخلفية ───────────────────────────────────────────
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message received:", payload);

  const notificationTitle = payload.notification?.title || "🦅 طلب جديد";
  const notificationBody =
    payload.notification?.body || "يا سقر 🦅 هناك طلبات تحلق في السماء";

  const notificationOptions = {
    body: notificationBody,
    icon: "/icon-192.png",        // أيقونة الإشعار
    badge: "/badge-72.png",        // شارة صغيرة
    sound: "/notification.mp3",    // صوت مخصص (اختياري)
    vibrate: [200, 100, 200],      // اهتزاز
    tag: "new-order-" + Date.now(), // يمنع تكديس الإشعارات
    requireInteraction: true,       // يبقى الإشعار حتى يُتفاعل معه
    data: payload.data || {},
    actions: [
      { action: "open", title: "📱 فتح التطبيق" },
      { action: "dismiss", title: "تجاهل" },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ─── عند الضغط على الإشعار ─────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") return;

  // فتح أو التركيز على نافذة التطبيق المفتوحة
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // إذا كان التطبيق مفتوحاً في نافذة — ركّز عليها وانتقل للـ URL
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        // إذا لم يكن مفتوحاً — افتح نافذة جديدة
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// ─── تفعيل الـ Service Worker فوراً ─────────────────────────────────────────
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) =>
  e.waitUntil(clients.claim())
);
