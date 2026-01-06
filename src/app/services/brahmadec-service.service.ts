import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrahmadecServiceService {
  
  url = 'https://brahmadev-backend.onrender.com'

  constructor(private http: HttpClient) { }

  login(params:any){
    return this.http.post(`${this.url}/login`, params)
  }

  verifyToken(params:any){
    return this.http.post(`${this.url}/verify-token`, params)
  }

  addVisit(params:any){
    return this.http.post(`${this.url}/site-details`, params)
  }

  getVisits(params:any){
    return this.http.post(`${this.url}/visits-by-token`, params)
  }

  getLeads(){
  return this.http.get(`${this.url}/leads`)
 }

 updateLeads(params:any, id:any){
  return this.http.patch(`${this.url}/leads/${id}`, params)
 }

updateLead(id: number, data: any){
    return this.http.patch(`${this.url}/${id}`, data);
  }

getLeadDetails(id: number){
    return this.http.get(`${this.url}/leads/${id}`);
  }

  getLeadCountNew(){
     return this.http.get(`${this.url}/leads/count/new`);
  }

  saveLead(params:any){
    return this.http.post(`${this.url}/meta-leads`, params)
  }
}
