import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  constructor(private route: Router){

  }
logOut(){
  localStorage.removeItem('role')
  sessionStorage.removeItem('token')
  this.route.navigate(['/login'])
}
}
