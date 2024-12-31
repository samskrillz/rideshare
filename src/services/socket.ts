import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const token = useAuthStore.getState().token;
    
    this.socket = io(import.meta.env.VITE_WS_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        this.handleReconnectFailure();
      }
    });
  }

  private handleReconnectFailure() {
    useAuthStore.getState().logout();
    // Implement user notification about connection failure
  }

  // Driver location updates
  updateLocation(location: { lat: number; lng: number }) {
    this.socket?.emit('driver:location', location);
  }

  // Ride status updates
  subscribeToRideUpdates(rideId: string, callback: (update: any) => void) {
    this.socket?.on(`ride:${rideId}:update`, callback);
  }

  // Cleanup
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
