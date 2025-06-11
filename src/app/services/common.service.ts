import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  serviceUrl = 'https://oneapp-backend.onrender.com/api/services/'
  metaDataUrl = 'https://oneapp-backend.onrender.com/api/metadata/3/'
  bannerUrl = 'https://oneapp-backend.onrender.com/api/banner/'
  polygon = 'https://oneapp-backend.onrender.com/api/polygon/6/'
  orders = 'https://oneapp-backend.onrender.com/api/orders/'
  suggestions = 'https://oneapp-backend.onrender.com/api/suggestions/user-suggestion/'
  eventsUrl = 'https://oneapp-backend.onrender.com/api/event/events-by-token/'
  createEventsUrl = 'https://oneapp-backend.onrender.com/api/event/'
  deleteEventUrl = 'https://oneapp-backend.onrender.com/api/event/delete-events-by-token/'

  getServices(){
    return this.http.get(this.serviceUrl)
  }

  getMetaData(){
    return this.http.get(this.metaDataUrl)
  }

  updateService(params:any,id:any){
    return this.http.put(`${this.serviceUrl}${id}/`, params)
  }

  createService(params:any){
    return this.http.post(`${this.serviceUrl}`, params)
  }

  deleteService(id:any){
    return this.http.delete(`${this.serviceUrl}${id}/`) 
  }

  updateMetaData(params:any, id:any){
    return this.http.put(`${this.metaDataUrl}`, params)
  }

  getBanners(){
    return this.http.get(this.bannerUrl)
  }

  createBanner(params:any){
    return this.http.post(this.bannerUrl, params)
  }

  deleteBanner(id:any){
    return this.http.delete(`${this.bannerUrl}${id}/`)
  }

  updateBanner(id:any, params:any){
    return this.http.put(`${this.bannerUrl}${id}/`, params)
  }

  getPolygonData(){
    return this.http.get(this.polygon)
  }

  updatePlygonData(params:any){
    return this.http.put(this.polygon, params)
  }

  getOrders(){
    return this.http.get(this.orders)
  }

  getSuggestions(params:any){
    return this.http.post(this.suggestions, params)
  }

  getEvents(params:any){
    return this.http.post(this.eventsUrl, params)
  }

  createEvent(params:any){
    return this.http.post(this.createEventsUrl, params)
  }

  deleteEvent(id:any, params:any){
    return this.http.post(`${this.deleteEventUrl}${id}/`, params)
  } 

  editEvent(id:any, params:any){
    return this.http.put(`${this.createEventsUrl}${id}/`, params)
  }
}
