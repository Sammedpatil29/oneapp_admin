import { Component, inject } from '@angular/core';
import { LoaderComponent } from "../loader/loader.component";
import { MatInputModule } from "@angular/material/input";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-notifications',
  imports: [LoaderComponent, MatInputModule, FormsModule, ButtonSpinnerComponent, CommonModule],
  templateUrl: './create-notifications.component.html',
  styleUrl: './create-notifications.component.css',
})
export class CreateNotificationsComponent {
  readonly dialog = inject(MatDialog);
  isLoading: boolean = false;
  view: any;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  title = '';
  body = '';
  imageUrl = '';
  showIcon: boolean = false;
  sendingNotification: boolean = false;
  savingNotification: boolean = false;
  selectedColor: string = '';
  smallIcon = 'oneapp'
  bgColor = '#050303ff'


  notifications = [
    {
      title: '🍎 Stock up on health with today’s organic offers!',
      body: 'Get up to 30% off on fruits, veggies & more. Offer valid today only!',
      imageUrl: '',
    },
    {
      title: '🛒 Fresh Deals Just for You!',
      body: 'Get up to 50% off on fruits, veggies & more. Offer valid today only!',
      imageUrl:
        'https://res.cloudinary.com/dvwggnqnw/image/upload/v1748684804/Untitled_lerp8s.png',
    },
    {
      title: '🥦 Fresh picks of the day!',
      body: 'Get up to 30% off on fruits, vOffer valid today only!',
      imageUrl: '',
    },
  ];

  sendNotification() {
    let params = {
    "title": this.title,
    "body": this.body,
    "imageUrl": this.imageUrl,
    "data": {
      "screen": "grocery_home",
      "promoCode": "SALE50"
    }
  };
this.sendingNotification = true
    this.commonService.sendNotification(params).subscribe(
      (res) => {
        this.title = '';
        this.body = '';
        this.imageUrl = '';
        this.sendingNotification = false
         this.dialog.open(AlertdialogComponent, {
      data: {
        title: 'Success',
        body: 'Successfully sent Push Notification!',
        type: 'success'
      }
    });
        console.log('Response:', res);
      },
      (error) => {
        this.sendingNotification = false
    this.dialog.open(AlertdialogComponent, {
      data: {
        title: 'Error',
        body: 'Failed to Send Push Notification',
        type: 'error'
      }
    });
        console.error('Error:', error);
      }
    );

    //   const url = 'https://fcm.googleapis.com/v1/projects/oneapp-74b5a/messages:send';

    //   const body = {
    //   "message": {
    //     "token": "cvX-ho_RSJ-g30sLv-WpSi:APA91bGky7m2dd6wf_pBbgIbOrUit_qeaSB32I-AZNw7ervyY6WYy9EHsTRZu4xNVmfC5wDRaLTP7wzE-W5FKO83JgZrNzQwn-BuF3Y4sCLmK-RvsJhstVI",
    //     "notification": {
    //       "title": this.title,
    //       "body": this.body,
    //       "image": this.imageUrl
    //     },
    //     "data": {
    //       "screen": "offers"
    //     },
    //     "android": {
    //     "notification": {
    //       "icon": "oneapp",
    //       "color": "black",
    //       "sound": "notificationsound"
    //     }
    //   }
    //   }
    // }

    //   const headers = new HttpHeaders({
    //     'Authorization': 'Bearer ya29.c.c0ASRK0GZKs9AmayfgHWpY2ySl4rZi5ehn1KRGNqjBkIuF4qsILSatWjYBp3jfxdDOC7APdh_ykqUNv5kV5tnP8S-5n9WHgiLzdG4Q7YjLpy5XsoeOH5q9RmK3qfKTw_Cvwq8EozOvfFt5HWzP4icpi56AGgfTOgaDMtr5V-QVKpUkhM6hpoxUu3lndDE4rV2d0P2OKWT7ysiUyVObcoh2P6UfZaJWlXbF2FoTApoIBriZPNt1T-p-f1mE1RNJvY2V4897MB1-INfLDcXD9zhcUR3-PFsPqzhlzYX_LL9NwySYD-TWNVqcgw4y3i3Z0-w0CMQmsoo8up-7Zpr0I4tmeILZcZi_eXB3RTzQ_3WJMq_hnfIcGUZAl06zYrnMXJG0wfQT396DZkrYwVfhdYvsFuIvSf0lneJhU2_fz9SmYY6zIc8nZtqpch4M9WfS_qw4czQtuRJXV3Q7jnn2jBeo5j8gv9cs9_S_4lhUln43rlae9vnciuZmo0lgiYUfIjjJ2SId67sl2jn-yfXXXbcS5sQlMawM42d5qgFflnZ-IxFuQM16zrlw-r-edd2xiaXwBbYBW_QW9Js3-sJ007xMm8BfM86B43n57yrX7O_ROkg6cMrY7_qMsUvZcwiOY7sxazpdIojaXJkMtk3-r5mraJ1155BztUjfqWMUQJSbXYdnpb8d_tuM2s-4x8vFMJfwlB54j4kbRld2ZZcixZjhJc-62yZISoJUkRit6SZob7IljywrFzMit1QbhOZtXwq071m3QY-dFIoomRF_osOJFn9Y0FY4zwmWe9I6m5fQaQv14XigVmB2kx3zbet1g3xufd_0IOjpz9xwdBFrro-XRqRtsja3kk4g8amb1p44blWkv5zxoooFpyqr-U_1VslzXpkaQc75znzm7Zhjj_sUW1UUFIzg9VYwMO5MomW9t4xFZfWSoeq_y28z93vYbj_5ByBW0p4lc2gX7u1rbISaJ_xFzsjaiyipygwkVl_dBZmpYcl7SI05uxM',
    //     'Content-Type': 'application/json'
    //   });

    //   this.http.post(url, body, { headers }).subscribe(
    //     (response) => {
    //       this.title = ''
    //       this.body = ''
    //       this.imageUrl = ''
    //       console.log('Response:', response);
    //     },
    //     (error) => {
    //       alert('Error while sending Notification')
    //       console.error('Error:', error);
    //     }
    //   );
  }

  duplicateNotification(item: any) {
    this.title = item.title;
    this.body = item.body;
    this.imageUrl = item.imageUrl;
  }

  onColorPicked(event: any) {
    this.selectedColor = event.target.value;
    console.log('Selected color:', this.selectedColor);
  }
}
