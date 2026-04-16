import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-settings',
  imports: [RouterLink, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  token: string | null = '';
  userDetails: any;

  constructor(
    private commonService: CommonService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    if (this.token) {
      this.getUserDetails();
    }
  }

  getUserDetails() {
    this.commonService.getUserDetails(this.token!).subscribe((res: any) => {
      if (res.success) {
        this.userDetails = res.data;
      }
    });
  }

  logOut() {
    this.authService.logout();
  }
}
