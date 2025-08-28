import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
  constructor(private route: Router){
  }

  ngOnInit(): void {
      this.token = sessionStorage.getItem('token')
            const decoded = jwtDecode<any>(this.token)
            this.role = decoded.role
            this.phone = decoded.phone
            console.log(this.role)
  }
  
logOut(){
  localStorage.removeItem('role')
  sessionStorage.removeItem('token')
  this.route.navigate(['/login'])
}
}
