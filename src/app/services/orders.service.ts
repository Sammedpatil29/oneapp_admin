import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  url = environment.apiUrl;


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getOrders(service:any, status?:any){
    return this.http.get(`${this.url}/api/admin/orders?service=${service}`)
  }

  updateOrder(params:any){
    const token = isPlatformBrowser(this.platformId) ? sessionStorage.getItem('token') : '';
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post(`${this.url}/api/grocery-order/update-status`, params, {headers: headers})
  }

  cancelOrder(params:any){
    const token = isPlatformBrowser(this.platformId) ? sessionStorage.getItem('token') : '';
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post(`${this.url}/api/grocery-order/cancel`, params, {headers: headers})
  }

  getRiders(){
    const token = isPlatformBrowser(this.platformId) ? sessionStorage.getItem('token') : '';
    return this.http.get(`${this.url}/api/rider/online`)
  }

  assignRider(params:any){
    const token = isPlatformBrowser(this.platformId) ? sessionStorage.getItem('token') : '';
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post(`${this.url}/api/grocery-order/assign-rider`, params, {headers: headers})
  }
}
