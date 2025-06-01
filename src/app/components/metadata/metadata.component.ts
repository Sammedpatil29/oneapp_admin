import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-metadata',
  imports: [MatDialogModule, CommonModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, LoaderComponent],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.css'
})
export class MetadataComponent implements OnInit{
metaData: any;
banners: any;
latest_version = ''
download_link = ''
last_updated = ''
otherDetails = ''
route = ''
imgUrl = ''
isCreateBanner:boolean = false
isMetaDataLoading:boolean = false
isBannersLoading:boolean = false
  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getMetaData()
      this.getbanners()
  }

  getMetaData(){
    this.isMetaDataLoading = true
    this.commonService.getMetaData().subscribe(res => {
        this.metaData = res
        this.latest_version = this.metaData.latest_version
        this.download_link = this.metaData.download_link
        this.last_updated = this.metaData.last_updated
        this.otherDetails = this.metaData.video
        this.isMetaDataLoading = false
         const parsed = JSON.parse(this.otherDetails);
    this.otherDetails = JSON.stringify(parsed, null, 10)
        
    })
  }

  updateMetaData(){
    console.log('clicked')
    let params = {
      "id": this.metaData.id,
    "latest_version": this.latest_version,
    "last_updated": this.last_updated,
    "download_link": this.download_link,
    "video": JSON.stringify(JSON.parse(this.otherDetails))
    }
    this.commonService.updateMetaData(params, this.metaData.id).subscribe(res => {
      alert('details updated successfully')
    })
  }

  getbanners(){
    this.isBannersLoading = true
    this.commonService.getBanners().subscribe((res)=>{
        this.banners = res
        this.isBannersLoading = false
    })
  }

  createBanner(){
    let params = {
      "img": this.imgUrl,
      "route": this.route
    }
    this.isBannersLoading = true
    this.commonService.createBanner(params).subscribe((res)=>{
      this.getbanners()
      this.isBannersLoading = false
      alert('banner created')
    })
  }

  deleteBanner(id:any){
    console.log('deleting')
    this.commonService.deleteBanner(id).subscribe((res)=> {
      this.getbanners()
      alert("banner deleted successfully")
    })
  }

  updateBanner(id:any, img:any, route:any){
    let params = {
      "img": img,
      "route": route
    }
    console.log(params)
    console.log('updating')
    this.commonService.updateBanner(id, params).subscribe((res)=> {
      this.getbanners()
      alert("banner updated successfully")
    })
  }

}
