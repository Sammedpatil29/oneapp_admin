import { Component } from '@angular/core';
import { LoaderComponent } from "../loader/loader.component";
import { MatInputModule } from "@angular/material/input";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-notifications',
  imports: [LoaderComponent, MatInputModule, FormsModule],
  templateUrl: './create-notifications.component.html',
  styleUrl: './create-notifications.component.css'
})
export class CreateNotificationsComponent {
isLoading: boolean = false
view: any;

constructor(private http: HttpClient){}

title = ''
body = ''
imageUrl = ''
showIcon: boolean = false

notifications = [
  {
    title: '🍎 Stock up on health with today’s organic offers!',
    body: 'Get up to 30% off on fruits, veggies & more. Offer valid today only!',
    imageUrl: ''
  },
  {
    title: '🛒 Fresh Deals Just for You!',
    body: 'Get up to 50% off on fruits, veggies & more. Offer valid today only!',
    imageUrl: 'https://res.cloudinary.com/dvwggnqnw/image/upload/v1748684804/Untitled_lerp8s.png'
  },
  {
    title: '🥦 Fresh picks of the day!',
    body: 'Get up to 30% off on fruits, vOffer valid today only!',
    imageUrl: ''
  }
]

 sendNotification() {
    const url = 'https://fcm.googleapis.com/v1/projects/oneapp-74b5a/messages:send';

    const body = {
    "message": {
      "token": "cvX-ho_RSJ-g30sLv-WpSi:APA91bGky7m2dd6wf_pBbgIbOrUit_qeaSB32I-AZNw7ervyY6WYy9EHsTRZu4xNVmfC5wDRaLTP7wzE-W5FKO83JgZrNzQwn-BuF3Y4sCLmK-RvsJhstVI",
      "notification": {
        "title": this.title,
        "body": this.body,
        "image": this.imageUrl
      },
      "data": {
        "screen": "offers"
      },
      "android": {
      "notification": {
        "icon": "oneapp",
        "color": "black"
      }
    }
    }
  }

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ya29.c.c0ASRK0GYMMfpuIexgRMTxwH-gY_RhBKYERYYcq0zMh-gJ3RLisulxTGSxnax6xG7yK8HJLldUvaOibkUv4tkAjDMiGf_hxWuKusMKIIKBUxwD1jViNnYWmwVWLE_qNWPAuGW9zJWb_dPMgswLUdfs-u1hGagknCCv0riditxoPByN26TACtWE-xqZtG7I8Hq7R34BgCEvUQ1GMIrZL4iciLt0lfOoPfS51oWYJDTLixfYUrjaMiqriDd1sY57mOK4VzgU6ZkK_PqQ4kKEaPKgQ56HcuJ7ffHhQw6C6qVDJmI-WxKUVBrZ3GKyvFJcGi1WxPl0y_1StfuzSQe8SBbismre65iXeuD_9fyGFWFzptdWAlMnxBTZHkWAewYoyiIIZRkT396Pt8Iyr58YaYi2duavifSQkq2ux-pJzniSunil9swBlIOOz8q-iVhRt8f14cpboz4fk482idcXXOII_mejs3QbrZxXo6Vp57aJrmOdOybWhkz3muneV8sjZfpR6MlzlqVSqzB48IFvZn1WOegmFac01qpdddOdc-JvzY2Qde4ZjeadvUg6uUhch80supIJU0O36j3nxQ3uoScFs04mZ4_qlhfhQ6iW6-g39kZOQJZ3IIwjrOobS93V1qIxsV8Rtc52B78ag6m3rjd1vw1kyfMIsc6F4mBhJlnBr35Bfb2X-ux0USRermqou6zzvy9wUWsa87nIYF62uWzg8-6kp55ylOBIJx70tnFfB4lBVS_UstwMug5JjOgVf6WcmOtbQu9FjtI77Qy6baycm-itegqOhS3bryoFdohnIBSc-FlMqk5o1o7nJFzbZoJsfhVRrlteb_ZXtvjn-n7MUh6utj4WlJbllXBuxrZ6BzYbFt7_6w3ZXdBOfsaaSs10uhhfzUIfymV0wiiw_dQqJWmxhwFx_Fme7uw1e3gcVXl4f9Mg18asZfmQUro1gnfv__kX1JRp7Fnsn2pMaXfl3OOglqQFfap1e4UZJzfh_ytqvMfeufckhbf',
      'Content-Type': 'application/json'
    });

    this.http.post(url, body, { headers }).subscribe(
      (response) => {
        this.title = ''
        this.body = ''
        this.imageUrl = ''
        console.log('Response:', response);
      },
      (error) => {
        alert('Error while sending Notification')
        console.error('Error:', error);
      }
    );
  }

  duplicateNotification(item:any){
    this.title = item.title
    this.body = item.body
    this.imageUrl = item.imageUrl
  }

}
