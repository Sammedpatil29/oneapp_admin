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


}
