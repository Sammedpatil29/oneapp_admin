import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {jwtDecode} from 'jwt-decode';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ButtonSpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  mobileNumber = ''
  password = ''
  isLoading:boolean = false

  constructor(private router: Router, private authService: AuthService){}

  logIn(){
    let params = {
      'phone': this.mobileNumber,
      'password': this.password
    }
    this.isLoading = true
    this.authService.Login(params).subscribe((res:any)=>{
      console.log(res)
      sessionStorage.setItem('token', res.token)
      try {
          const decoded = jwtDecode<any>(res.token);
          this.router.navigate(['/layout/home']);
        } catch (err) {
          console.error('Error decoding token', err);
        }
        this.isLoading = false
    }, error => {
      this.isLoading = false
      console.log('Error Logging In')
      alert('Error Logging In')
    })
    
  }

  forgotPassword(){
    alert('Contact your admin to reset your password')
  }

}
