import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
  readonly dialog = inject(MatDialog);
role:string | null = ''
token: any = ''
  constructor(private router: Router){
    
  }

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token')
      const decoded = jwtDecode<any>(this.token)
      this.role = decoded.role
      console.log(this.role)
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
}
