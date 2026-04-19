import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle } from "@angular/material/dialog";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from '../../services/common.service';



@Component({
  selector: 'app-grocery-categories',
  imports: [MatDialogContent, MatFormField, MatLabel, FormsModule, MatDialogActions, MatInputModule, MatFormFieldModule, MatDialogClose, MatDialogTitle],
  templateUrl: './grocery-categories.component.html',
  styleUrl: './grocery-categories.component.css'
})
export class GroceryCategoriesComponent implements OnInit {
name: any;
bg: any;
img: any;
mode: any = 'add'
selectedCategoryId: any;
categories: any[] = []

constructor(private commonService: CommonService) { }

ngOnInit(): void {
  this.getCategories()
}

addCategory(){
  let params = {
    name: this.name,
    bg: this.bg,
    img: this.img
  }
  this.commonService.addNewCategory(params).subscribe((res:any)=>{
    this.name = ''
    this.bg = ''
    this.img = ''
    this.getCategories()
  }, error => {
    console.log(error)
  })
}

getCategories(){
  this.commonService.getGroceryCategories().subscribe((res:any)=>{
    this.categories = res.data
  }, error => {
    console.log(error)
  })
}

selectCategory(cat: any){
  this.mode = 'update'
  this.name = cat.name
  this.bg = cat.bg
  this.img = cat.img
  this.selectedCategoryId = cat.id
}

updateCategory(){
  let params = {
    name: this.name,
    bg: this.bg,
    img: this.img
  }
  this.commonService.updateCategory(this.selectedCategoryId, params).subscribe((res:any)=>{
    this.name = ''
    this.bg = ''
    this.img = ''
    this.mode = 'add'
    this.getCategories()
  }, error => {    console.log(error)
  })
}

deleteCategory(){
  this.commonService.deleteCategory(this.selectedCategoryId).subscribe((res:any)=>{
    this.name = ''
    this.bg = ''
    this.img = ''
    this.mode = 'add'
    this.getCategories()
  }, error => {    console.log(error)
  })
}
}
