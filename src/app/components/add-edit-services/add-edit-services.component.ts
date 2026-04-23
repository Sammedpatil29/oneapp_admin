import { Component, Inject, OnInit } from '@angular/core';
import {ChangeDetectionStrategy, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { CommonService } from '../../services/common.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";
import { DialogRef } from '@angular/cdk/dialog';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

@Component({
  selector: 'app-add-edit-services',
  imports: [MatDialogModule, CommonModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, ButtonSpinnerComponent],
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
selectedCities = []
imgUrl = ''
category: any
selectedCategory = ''
isSaving: boolean = false
isUpdating: boolean = false
isDeleting: boolean = false

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService, private dialog: MatDialog, private dialogRef: MatDialogRef<AddEditServicesComponent>){
    console.log(data)
  }

  ngOnInit(): void {
      this.getMetaData()
      this.className = '{"right":"-20px","width":"80px","bottom":"-20px","z-index":"-1","position":"absolute"}'
      if(this.data.type == 'edit'){
        this.title = this.data.item.title
        this.subTitle = this.data.item.subtitle
        this.offers = this.data.item.offers
        this.width = this.data.item.width
        this.route = this.data.item.route
        this.selectedStatus = this.data.item.status
        this.className = JSON.stringify(this.data.item.className)
        this.selectedCities = this.data.item.city
        console.log(this.selectedCities)
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
    this.isUpdating = true
    this.commonService.updateService(params,this.data.item.id).subscribe((res)=>{
    
    this.dialog.open(AlertdialogComponent, {
      data: {
        title: 'success',
        body: 'Item updated successfully',
        type: 'success',
      },
    });
          this.isUpdating = false
    this.dialogRef.close();
    }, error => {
      console.log('error occured')
      this.isUpdating = false
this.dialog.open(AlertdialogComponent, {
  data: {
    title: 'error',
    body: 'Failed to update Item',
    type: 'error',
  },
});
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
    this.isSaving = true
    this.commonService.createService(params).subscribe((res)=> {
        this.isSaving = false
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'success',
            body: 'Item added successfully',
            type: 'success',
          },
        });
        this.dialogRef.close();
    }, error => {
      this.isSaving = false
this.dialog.open(AlertdialogComponent, {
  data: {
    title: 'error',
    body: 'Failed to add Item',
    type: 'error',
  },
});
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
