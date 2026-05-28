importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAS2dSLHBkOgazBtHGTH4QVHV_-yk2m_Ec",
  authDomain: "shaheeeen-5e984.firebaseapp.com",
  projectId: "shaheeeen-5e984",
  storageBucket: "shaheeeen-5e984.firebasestorage.app",
  messagingSenderId: "1037170142697",
  appId: "1:1037170142697:web:9ae5212433e3e6e755ef78"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// عرض الإشعار عندما يكون التطبيق مغلقاً
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // تأكد من وجود صورة بهذا المسار أو غيره لمسار شعار صقور شاهين
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});