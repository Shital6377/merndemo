import { initializeApp } from 'firebase/app';

// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

initializeApp(firebaseConfig);

// const messaging = getMessaging();

let messaging = null;
// messaging = getMessaging();

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });


export const requestForToken = async () => {
    try {
        const currentToken = await getToken(messaging, { vapidKey: process.env.REACT_APP_FIREBASE_MESSAGE_KEY });
        if (currentToken) {
            localStorage.setItem("fcm_device_token", currentToken);
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
    }
};