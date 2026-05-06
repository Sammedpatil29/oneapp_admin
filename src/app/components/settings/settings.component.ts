import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../auth.service';
import { LoaderComponent } from "../loader/loader.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

@Component({
  selector: 'app-settings',
  imports: [RouterLink, CommonModule, LoaderComponent, MatDialogModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  token: string | null = '';
  userDetails: any;
  isLoading: boolean = false;


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
    this.isLoading = true;
    this.commonService.getUserDetails(this.token!).subscribe((res: any) => {
      if (res.success) {
        this.userDetails = res.data;
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    }, error => {
      this.isLoading = false;
    });
  }

  logOut() {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      data: {
        title: 'Confirm Logout',
        body: 'Are you sure you want to logout?',
        type: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true' || result === true) {
        this.authService.logout();
      }
    });
  }
}
