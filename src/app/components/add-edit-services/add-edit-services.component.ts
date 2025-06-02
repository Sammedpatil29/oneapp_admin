import { Component, Inject, OnInit } from '@angular/core';
import {ChangeDetectionStrategy, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { CommonService } from '../../services/common.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-add-edit-services',
  imports: [MatDialogModule, MatButtonModule,FormsModule, MatFormFieldModule, MatInputModule,MatFormFieldModule, MatSelectModule, FormsModule],
  templateUrl: './add-edit-services.component.html',
  styleUrl: './add-edit-services.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditServicesComponent implements OnInit{
 metaData: any = []
cities: any;
status: any = [];
title = ''
subTitle = ''
offers = ''
width = ''
route = ''
selectedStatus = ''
className: any
selectedCities: any
imgUrl = ''
category: any
selectedCategory = ''

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService){
    console.log(data)
  }

  ngOnInit(): void {
      this.getMetaData()
      if(this.data.type == 'edit'){
        this.title = this.data.item.title
        this.subTitle = this.data.item.subtitle
        this.offers = this.data.item.offers
        this.width = this.data.item.width
        this.route = this.data.item.route
        this.selectedStatus = this.data.item.status
        this.className = JSON.stringify(this.data.item.className)
        this.selectedCities = this.data.item.cities
        this.imgUrl = this.data.item.img
        this.selectedCategory = this.data.item.category
      }
  }

  getMetaData(){
    this.commonService.getMetaData().subscribe(res => {
      console.log(res)
      this.metaData = res
      let data = JSON.parse(this.metaData.video)
      this.cities = data.cities
      this.status = data.status
      this.category = data.categories
      console.log(this.cities)
    })
  }

  updateServices(){
    let params = {
    "title": this.title,
    "subtitle": this.subTitle,
    "img": this.imgUrl,
    "offers": this.offers,
    "width": this.width,
    "route": this.route,
    "category": this.selectedCategory,
    "city": this.selectedCities,
    "status": this.selectedStatus,
    "className": JSON.parse(this.className)
    }
    this.commonService.updateService(params,this.data.item.id).subscribe((res)=>{
      console.log('updated')
    }, error => {
      console.log('error occured')
    })
  }

  createService(){
    let params = {
    "title": this.title,
    "subtitle": this.subTitle,
    "img": this.imgUrl,
    "offers": this.offers,
    "width": this.width,
    "route": this.route,
    "category": this.selectedCategory,
    "city": this.selectedCities,
    "status": this.selectedStatus,
    "className": JSON.parse(this.className)
    }
    this.commonService.createService(params).subscribe((res)=> {
      alert('created successfully')
    })
  }

  count = 0
  deleteService(){
    this.count = this.count + 1
    if(this.count == 10){
      this.commonService.deleteService(this.data.item.id).subscribe(res=>{
        alert('item deleted successfully')
      })
    }

  }

}
