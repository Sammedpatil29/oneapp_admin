import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { SettingsComponent } from '../settings/settings.component';
import { environment } from '../../../environments/environment';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
role:string | null = ''
token: any = ''
year = new Date().getFullYear()
version = environment.version

showAlarm: boolean = false;
private orderSubscription: Subscription | undefined;
private audio: HTMLAudioElement | undefined;
private alarmTimeout: any;
isConnected: boolean = false;
private connectSub: Subscription | undefined;
private disconnectSub: Subscription | undefined;

  constructor(private router: Router, private socketService: SocketService){
    // this.year = new Date().getFullYear()
  }

  // Listen for browser tab visibility changes
  @HostListener('document:visibilitychange', [])
  onVisibilityChange() {
    if (document.visibilityState === 'visible') {
      // Reconnect the socket immediately when the user returns to this tab
      this.socketService.connect();
    }
  }

  ngOnInit(): void {
    this.socketService.connect();

    this.orderSubscription = this.socketService.on<any>('new order').subscribe((data) => {
      this.triggerAlarm();
    });

    this.connectSub = this.socketService.on<any>('connect').subscribe(() => {
      this.isConnected = true;
    });

    this.disconnectSub = this.socketService.on<any>('disconnect').subscribe(() => {
      this.isConnected = false;
    });

    this.token = sessionStorage.getItem('token')
      const decoded = jwtDecode<any>(this.token)
      this.role = decoded.role
      console.log(this.role)

    // Pre-load the audio instance once when the component initializes
    this.audio = new Audio('assets/mixkit-urgent-digital-alarm-tone-loop-2973.mp3');
    this.audio.load();
  }

  triggerAlarm() {
    this.showAlarm = true;

    // Clear previous timer and audio if an alarm is already playing
    if (this.alarmTimeout) clearTimeout(this.alarmTimeout);
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.audio?.play().catch(err => console.error('Audio play failed (maybe blocked by browser):', err));

    this.alarmTimeout = setTimeout(() => {
      this.showAlarm = false;
      this.audio?.pause();
    }, 10000); // Stop after 10 seconds
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
    this.orderSubscription?.unsubscribe();
    this.audio?.pause();
    if (this.alarmTimeout) clearTimeout(this.alarmTimeout);
    this.connectSub?.unsubscribe();
    this.disconnectSub?.unsubscribe();
  }

openSettings(){
  console.log('hbfwgfyewgf')
  this.router.navigate(['/layout/settings'])
// this.dialog.open(SettingsComponent, {
//       data: {
//         title: 'Success',
//         body: 'Successfully sent Push Notification!',
//         type: 'success'
//       }
//     });
}

isSettings(){
  return this.router.url == '/layout/settings';
}

connected = {
  title: 'success',
  body: 'Socket is connected and Looking for orders...',
  type: 'success'
}

disconnected = {
  title: 'error',
  body: 'Socket is disconnected',
  type: 'error'
}

openAlert(data:any){
  this.dialog.open(AlertdialogComponent, {
    data: data
  });
}
}
