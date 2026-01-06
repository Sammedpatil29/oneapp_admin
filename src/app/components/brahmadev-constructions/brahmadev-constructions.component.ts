import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrahmadecServiceService } from '../../services/brahmadec-service.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brahmadev-constructions',
  imports: [FormsModule, CommonModule],
  templateUrl: './brahmadev-constructions.component.html',
  styleUrl: './brahmadev-constructions.component.css'
})
export class BrahmadevConstructionsComponent {
  showLogin: boolean = true;
  isLoading: boolean = false;

  phoneNumber: string = '';
  password: string = '';

  constructor(private loginService: BrahmadecServiceService, private router: Router){}

  login(){
    let params = {
      "phone": this.phoneNumber,
      "password": this.password
    }
    this.isLoading = true
    this.loginService.login(params).subscribe((res:any)=>{
      if(res.token){
        sessionStorage.setItem('userToken', res.token)
        const decoded: any = jwtDecode(res.token);
        sessionStorage.setItem('userName', decoded.username)
        this.isLoading = false
        this.router.navigate(['/b-layout'])
      } else {
        this.isLoading = false
        alert('login failed')
      }
      
    }, error => {
      this.isLoading = false
      alert('something went wrong')
    })
  }

  async verifyToken(){
    let token = await localStorage.getItem('userToken')
    if(!token){
      this.showLogin = true
    } else {
      this.loginService.verifyToken({token}).subscribe((res:any)=>{
      if(res.valid == true){
        this.router.navigate(['/b-layout'])
      } else {
        this.showLogin = true
      }
    })
    }
    
  }

  // Helper to ensure only numbers are typed
  onlyNumbers(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
