import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  // Define the fields you expect
  phone: string;
  role: string;
  exp: number;
  iat: number;
  [key: string]: any; // For additional custom claims
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  createToken = 'https://oneapp-backend.onrender.com/api/adminuserlogin/admin-create-token/'
  url = `https://oneapp-express-singapore.onrender.com`

Login(params:any){
  return this.http.post(`${this.url}/api/admin/login`, params)
}

isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return true; // Token is valid
    } catch (err) {
      return false; // Invalid token
    }
  }

}
