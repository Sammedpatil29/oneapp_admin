import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-settings',
  imports: [RouterLink, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{

  token: any = ''
  role: any = ''
  phone: any = ''
  userDetails: any;
  constructor(private route: Router, private commonService: CommonService){
  }

  ngOnInit(): void {
      this.token = sessionStorage.getItem('token')
      this.getUserDetails()
  }

  getUserDetails(){
    this.commonService.getUserDetails(this.token).subscribe((res:any)=>{
      this.userDetails = res.data
    })
  }
  
logOut(){
  localStorage.removeItem('role')
  sessionStorage.removeItem('token')
  this.route.navigate(['/login'])
}
}
