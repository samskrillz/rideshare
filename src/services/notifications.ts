import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export class NotificationService {
  static async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging);
        return token;
      }
      throw new Error('Notification permission denied');
    } catch (error) {
      console.error('Notification error:', error);
      throw error;
    }
  }

  static onMessageReceived(callback: (payload: any) => void) {
    return onMessage(messaging, callback);
  }
}
