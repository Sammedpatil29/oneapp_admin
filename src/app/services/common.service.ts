import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  orders = 'https://oneapp-backend.onrender.com/api/orders/all-orders/'
  suggestions = 'https://oneapp-backend.onrender.com/api/suggestions/admin-suggestion/'
  eventsUrl = 'https://oneapp-backend.onrender.com/api/event/events-by-token/'
  createEventsUrl = 'https://oneapp-backend.onrender.com/api/event/'
  deleteEventUrl = 'https://oneapp-backend.onrender.com/api/event/delete-events-by-token/'
  getUsersUrl = 'https://oneapp-backend.onrender.com/api/adminuser/admin-list/'
  createUserUrl = 'https://oneapp-backend.onrender.com/api/adminuser/admin-create/'
  serviceCountUrl = 'https://oneapp-backend.onrender.com/api/services/count/'
  ordersCountUrl = 'https://oneapp-backend.onrender.com/api/orders/scheduled-orders/'
  updateUserUrl = 'https://oneapp-backend.onrender.com/api/adminuser/admin-detail/'
  deleteUserUrl = 'https://oneapp-backend.onrender.com/api/adminuser/admin-delete/'
  getGroceryListUrl = 'https://oneapp-backend.onrender.com/api/grocery/grocery-list/'
  createGroceryListUrl = 'https://oneapp-backend.onrender.com/api/grocery/grocery-create/'
  updateGroceryListUrl = 'https://oneapp-backend.onrender.com/api/grocery/grocery-detail/'
  deleteGroceryListUrl = 'https://oneapp-backend.onrender.com/api/grocery/grocery-delete/'
  sendNotificationUrl = 'https://oneapp-backend.onrender.com/api/users/send-to-all/'
  getAllSupportTicketsUrl = 'https://oneapp-backend.onrender.com/api/ticket/admin-ticket-list/'
  createSupportTicketsUrl = 'https://oneapp-backend.onrender.com/api/ticket/admin-ticket-create/'
  updateSupportTicketsUrl = 'https://oneapp-backend.onrender.com/api/ticket/admin-ticket-update'
  deleteSupportTicketsUrl = 'https://oneapp-backend.onrender.com/api/ticket/admin-ticket-delete/'
  allVisitsUrl = 'https://brahmadev-backend.onrender.com/all-visits'

  url = `https://oneapp-express-singapore.onrender.com`

  getServices(){
    return this.http.get(`${this.url}/service`)
  }

  getMetaData(){
    return this.http.get(this.metaDataUrl)
  }

  updateService(params:any,id:any){
    return this.http.put(`${this.url}/service/${id}`, params)
  }

  createService(params:any){
    return this.http.post(`${this.url}/service`, params)
  }

  deleteService(id:any){
    return this.http.delete(`${this.url}/service/${id}/`) 
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
    return this.http.get(`${this.url}/api/metadata`)
  }

  updatePlygonData(params:any){
    return this.http.patch(`${this.url}/api/metadata`, params)
  }

  getOrders(params:any){
    return this.http.post(this.orders, params)
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

  getAllUsers(params:any){
    return this.http.get(`${this.url}/api/admin/list`)
  }

  createUser(params:any){
    return this.http.post(`${this.url}/api/admin/create`, params)
  }

  updateUser(id:any, params:any){
    return this.http.put(`${this.url}/api/admin/${id}/`, params)
  }

  getUserDetails(token:any){
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get(`${this.url}/api/admin/profile`, {headers: headers})
  }

  servicesCount(){
    return this.http.get(this.serviceCountUrl)
  }

  ordersCount(){
    return this.http.get(this.ordersCountUrl)
  }

  deleteUser(id:any, params:any){
    return this.http.post(`${this.deleteUserUrl}${id}/`, params)
  } 

  getGroceryList(params:any){
    return this.http.get(`${this.url}/api/grocery`, params)
  }

  createGroceryItem(params:any){
    return this.http.post(`${this.url}/api/grocery`, params)
  }

  updateGroceryItem(id:any, params:any){
    return this.http.put(`${this.url}/api/grocery/${id}/`, params)
  }

  deleteGroceryItem(id:any, params:any){
    return this.http.delete(`${this.url}/api/grocery/${id}/`, params)
  }

  sendNotification(params:any){
    return this.http.post(`${this.url}/api/notifications/send-all`, params)
  }

  getAllSupportTickets(params:any){
    return this.http.post(`${this.getAllSupportTicketsUrl}`, params)
  }

  createSupportTickets(params:any){
    return this.http.post(`${this.createSupportTicketsUrl}`, params)
  }

  updateSupportTickets(params:any, id:any){
    return this.http.post(`${this.updateSupportTicketsUrl}/${id}/`, params)
  }

  deleteSupportTickets(params:any, id:any){
    return this.http.post(`${this.deleteSupportTicketsUrl}${id}/`, params)
  }

  getAllVisits(){
    return this.http.get(this.allVisitsUrl)
  }
}
