import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit{
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
}
}
