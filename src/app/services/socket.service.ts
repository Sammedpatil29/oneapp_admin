import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl, {
      autoConnect: false,
    });
  }

  connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
      console.log('Socket connected');
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
      console.log('Socket disconnected');
    }
  }

  on<T>(eventName: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      this.socket.on(eventName, (data: T) => subscriber.next(data));

      return () => {
        this.socket.off(eventName);
      };
    });
  }

  emit(eventName: string, data?: any): void {
    this.socket.emit(eventName, data);
  }
}
