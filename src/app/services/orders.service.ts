import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  url = `https://oneapp-express-singapore.onrender.com`


  constructor(private http: HttpClient) { }

  getOrders(service:any, status?:any){
    return this.http.get(`${this.url}/api/admin/orders?service=${service}`)
  }
}
