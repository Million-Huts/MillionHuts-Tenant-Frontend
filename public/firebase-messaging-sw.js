importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyA4rZSmpBFAvvTUf4W7lRP9PaLIT5dsbQA",
    authDomain: "millionhuts-d2a5f.firebaseapp.com",
    projectId: "millionhuts-d2a5f",
    storageBucket: "millionhuts-d2a5f.firebasestorage.app",
    messagingSenderId: "983127486850",
    appId: "1:983127486850:web:757205bc3b906e61729f9b",
    measurementId: "G-5XX18QX0F7"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/icon.png",
    });
});