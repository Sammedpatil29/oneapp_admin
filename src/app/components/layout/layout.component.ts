import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { SettingsComponent } from '../settings/settings.component';
import { environment } from '../../../environments/environment';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { SidebarMidService } from '../../services/sidebar-mid.service';


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

  private audioUnlocked: boolean = false;

   sidebarItems:any = []
  //  [
  //   {
  //     routerLink: ['/layout/home'],
  //     routerLinkActiveOptions: { exact: true },
  //     title: 'Home',
  //     svg: "M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z",
  //   },
  //   {
  //     routerLink: ['/layout/inventory'],
  //     title: 'Inventory',
  //     svg: "M120-40v-880h80v80h560v-80h80v880h-80v-80H200v80h-80Zm80-480h80v-160h240v160h240v-240H200v240Zm0 320h240v-160h240v160h80v-240H200v240Zm160-320h80v-80h-80v80Zm160 320h80v-80h-80v80ZM360-520h80-80Zm160 320h80-80Z",
  //     requiredRole: 'admin',
  //     notification: true,
  //   },
  //   {
  //     routerLink: ['/layout/orders-layout'],
  //     routerLinkActiveOptions: { exact: true },
  //     title: 'Orders',
  //     svg: "M160-160v-516L82-846l72-34 94 202h464l94-202 72 34-78 170v516H160Zm240-280h160q17 0 28.5-11.5T600-480q0-17-11.5-28.5T560-520H400q-17 0-28.5 11.5T360-480q0 17 11.5 28.5T400-440ZM240-240h480v-358H240v358Zm0 0v-358 358Z",
  //     notification: true,
  //   },
  //   // {
  //   //   routerLink: ['/layout/suggestions'],
  //   //   routerLinkActiveOptions: { exact: true },
  //   //   title: 'Manage Tickets',
  //   //   svg: "M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm0-160q17 0 28.5-11.5T520-480q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480q0 17 11.5 28.5T480-440Zm0-160q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm320 440H160q-33 0-56.5-23.5T80-240v-160q33 0 56.5-23.5T160-480q0-33-23.5-56.5T80-560v-160q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v160q-33 0-56.5 23.5T800-480q0 33 23.5 56.5T880-400v160q0 33-23.5 56.5T800-160Zm0-80v-102q-37-22-58.5-58.5T720-480q0-43 21.5-79.5T800-618v-102H160v102q37 22 58.5 58.5T240-480q0 43-21.5 79.5T160-342v102h640ZM480-480Z",
  //   //   notification: true,
  //   // },
  //   {
  //     routerLink: ['/layout/notifications'],
  //     title: 'Notifications',
  //     svg: "M480-500Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Zm240-360v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q14 4 27.5 8.5T593-772q-15 14-27 30.5T545-706q-15-7-31.5-10.5T480-720q-66 0-113 47t-47 113v280h320v-112q18 11 38 18t42 11v83h80v80H160Z",
  //     requiredRole: 'admin',
  //   },
  //   {
  //     routerLink: ['/layout/metadata'],
  //     routerLinkActiveOptions: { exact: true },
  //     title: 'Meta Data',
  //     svg: "M480-120q-151 0-255.5-46.5T120-280v-400q0-66 105.5-113T480-840q149 0 254.5 47T840-680v400q0 67-104.5 113.5T480-120Zm0-479q89 0 179-25.5T760-679q-11-29-100.5-55T480-760q-91 0-178.5 25.5T200-679q14 30 101.5 55T480-599Zm0 199q42 0 81-4t74.5-11.5q35.5-7.5 67-18.5t57.5-25v-120q-26 14-57.5 25t-67 18.5Q600-528 561-524t-81 4q-42 0-82-4t-75.5-11.5Q287-543 256-554t-56-25v120q25 14 56 25t66.5 18.5Q358-408 398-404t82 4Zm0 200q46 0 93.5-7t87.5-18.5q40-11.5 67-26t32-29.5v-98q-26 14-57.5 25t-67 18.5Q600-328 561-324t-81 4q-42 0-82-4t-75.5-11.5Q287-343 256-354t-56-25v99q5 15 31.5 29t66.5 25.5q40 11.5 88 18.5t94 7Z",
  //   },
  //   {
  //     routerLink: ['/layout/validation'],
  //     routerLinkActiveOptions: { exact: true },
  //     title: 'Validation',
  //     svg: "M481-779.67q107.33 0 202.33 45.84 95 45.83 158 131.83 4.34 6.33 3.17 10.67-1.17 4.33-5.17 8-4 3.66-9.66 3.5Q824-580 819.33-586q-57.66-80.67-147.5-123.83Q582-753 481-753q-101 0-189.33 43.5-88.34 43.5-147 123.5-4.67 6.33-9.67 7.33t-9.67-2q-5-3-5.5-8.5t2.84-10.83q62-85.67 156.5-132.67 94.5-47 201.83-47Zm0 95.34q135.67 0 233 90 97.33 90 97.33 222.33 0 47.33-34.5 79.83t-83.5 32.5q-49.66 0-85.16-32.5T572.67-372q0-37-27.17-61.83-27.17-24.84-64.5-24.84t-64.83 24.84Q388.67-409 388.67-372q0 101.67 61.16 169.67Q511-134.33 604-107q7 2.33 9 6.67 2 4.33.67 9.66-1.34 5.67-5.34 8.67T598-81q-103.33-26-169.67-103.17Q362-261.33 362-372q0-48 35-80.67 35-32.66 84-32.66t84 32.66Q600-420 600-372q0 36.33 28 61.17Q656-286 693.33-286 730-286 757-310.83q27-24.84 27-61.17 0-120.67-89.33-202.33Q605.33-656 481.33-656T268-574.33q-89.33 81.66-89.33 202 0 24 5.16 61.66Q189-273 206.67-224.33 209-218 206.5-214t-7.17 6.33q-5.33 2.34-10.83.5-5.5-1.83-7.83-7.83-13.67-38.33-20.84-77.5-7.16-39.17-7.16-79.5 0-130.33 97.5-221.33t230.83-91Zm0-195.34q64.67 0 126.67 15.84 62 15.83 119 44.83 6.33 3 7.16 8 .84 5-1.5 9.33-2.33 4.34-7 7Q720.67-792 714-795q-54.33-27-113.17-42.17Q542-852.33 481-852.33q-60.67 0-118.67 14.16-58 14.17-111 43.17-6 3-10.33 1.17-4.33-1.84-7-6.5-2.67-4-2-8.84.67-4.83 5.33-7.83Q294-847.67 356-863.67t125-16Zm0 295q92.33 0 159 61.5T706.67-372q0 6.33-3.5 9.83t-9.84 3.5q-6 0-10-3.5t-4-9.83q0-79-58.83-132.5T481-558q-80.67 0-138.5 53.5T284.67-372q0 83.67 29 142.5t85.66 117.83Q404-107 403.67-102q-.34 5-4.34 9-3.33 3.33-9 4.33-5.66 1-10.33-4.33-58.33-60.67-90.5-126.17T257.33-372q0-89.67 65.67-151.17 65.67-61.5 158-61.5ZM480-386q6.33 0 9.83 4t3.5 10q0 79 57.67 130t133.67 51q7.33 0 18.33-1 11-1 23.67-3 6.33-1.33 10.5 1.83 4.16 3.17 5.5 8.17 1.33 5.33-1.34 9.33-2.66 4-8.66 5.34-18 5-31.5 5.5t-16.5.5q-88.34 0-153.17-59-64.83-59-64.83-148.67 0-6 3.5-10t9.83-4Z",
  //     notification: true,
  //   },
  //   {
  //     routerLink: ['/layout/manageUsers'],
  //     routerLinkActiveOptions: { exact: true },
  //     title: 'Manage Users',
  //     svg: "M680-280q25 0 42.5-17.5T740-340q0-25-17.5-42.5T680-400q-25 0-42.5 17.5T620-340q0 25 17.5 42.5T680-280Zm0 120q31 0 57-14.5t42-38.5q-22-13-47-20t-52-7q-27 0-52 7t-47 20q16 24 42 38.5t57 14.5ZM480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v227q-19-8-39-14.5t-41-9.5v-147l-240-90-240 90v188q0 47 12.5 94t35 89.5Q310-290 342-254t71 60q11 32 29 61t41 52q-1 0-1.5.5t-1.5.5Zm200 0q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80ZM480-494Z",
  //     requiredRole: 'admin',
  //   },
  //   {
  //     routerLink: ['/layout/settings'],
  //     routerLinkActiveOptions: { exact: true },
  //     title: 'Settings',
  //     svg: "m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z",
  //   },
  // ];

  constructor(private router: Router, private socketService: SocketService, private cdr: ChangeDetectorRef, private commonService: CommonService, private sidebarMidService: SidebarMidService) {
    // this.year = new Date().getFullYear()
  }

  // Unlock audio context for strict browsers (like Safari) on first user interaction
  @HostListener('document:click')
  unlockAudio() {
    if (!this.audioUnlocked && this.audio && !this.showAlarm) {
      this.audio.muted = true;
      this.audio.play().then(() => {
        this.audio?.pause();
        if (this.audio) { this.audio.currentTime = 0; this.audio.muted = false; }
        this.audioUnlocked = true;
      }).catch(() => {});
    }
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
      this.cdr.detectChanges();
    });

    this.disconnectSub = this.socketService.on<any>('disconnect').subscribe(() => {
      this.isConnected = false;
      this.cdr.detectChanges();
    });

    this.token = sessionStorage.getItem('token')
      const decoded = jwtDecode<any>(this.token)
      this.role = decoded.role
      console.log(this.role)

    // Pre-load the audio instance once when the component initializes
    this.audio = new Audio('assets/mixkit-urgent-digital-alarm-tone-loop-2973.mp3');
    this.audio.loop = true;
    this.audio.load();
    this.getSidebarItems()

    this.sidebarMidService.$value.subscribe(() => {
      this.getSidebarItems();
    })

  }

  triggerAlarm() {
    this.showAlarm = true;
    this.cdr.detectChanges(); // Ensure the UI updates immediately if called outside Angular Zone

    // Clear previous timer and audio if an alarm is already playing
    if (this.alarmTimeout) clearTimeout(this.alarmTimeout);
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio.play().catch(err => console.error('Audio play failed (maybe blocked by browser):', err));
    }

  }

  stopAlarm(){
    this.showAlarm = false;
      this.audio?.pause();
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
  body: 'Connected and Looking for orders...',
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

getSidebarItems(){
  this.commonService.getSidebarItems().subscribe((res:any)=>{
    this.sidebarItems = res.data.filter((item:any) => item.is_active === true);
    if(this.sidebarItems.length == 0){
      this.sidebarItems.push({
      routerLink: ['/layout/metadata'],
      routerLinkActiveOptions: { exact: true },
      title: 'Meta Data',
      svg: "M480-120q-151 0-255.5-46.5T120-280v-400q0-66 105.5-113T480-840q149 0 254.5 47T840-680v400q0 67-104.5 113.5T480-120Zm0-479q89 0 179-25.5T760-679q-11-29-100.5-55T480-760q-91 0-178.5 25.5T200-679q14 30 101.5 55T480-599Zm0 199q42 0 81-4t74.5-11.5q35.5-7.5 67-18.5t57.5-25v-120q-26 14-57.5 25t-67 18.5Q600-528 561-524t-81 4q-42 0-82-4t-75.5-11.5Q287-543 256-554t-56-25v120q25 14 56 25t66.5 18.5Q358-408 398-404t82 4Zm0 200q46 0 93.5-7t87.5-18.5q40-11.5 67-26t32-29.5v-98q-26 14-57.5 25t-67 18.5Q600-328 561-324t-81 4q-42 0-82-4t-75.5-11.5Q287-343 256-354t-56-25v99q5 15 31.5 29t66.5 25.5q40 11.5 88 18.5t94 7Z",
      is_active: true,
    })
  }
  })
}

openDialog(){
  this.dialog.open(AlertdialogComponent, {
    data: {
      title: 'info',
      body: 'Help is on the way!',
      type: 'info'
    }
  });
}
}
