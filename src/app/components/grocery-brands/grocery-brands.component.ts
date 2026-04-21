import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle } from "@angular/material/dialog";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from '../../services/common.service';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";


@Component({
  selector: 'app-grocery-brands',
  imports: [MatDialogContent, MatFormField, MatLabel, FormsModule, MatDialogActions, MatInputModule, MatFormFieldModule, MatDialogClose, MatDialogTitle, ButtonSpinnerComponent],
  templateUrl: './grocery-brands.component.html',
  styleUrl: './grocery-brands.component.css'
})
export class groceryBrandsComponent implements OnInit {
name: any;
bg: any;
img: any;
mode: any = 'add'
selectedBrandId: any;
brands: any[] = []
isLoading: boolean = false
isSaving: boolean = false

constructor(private commonService: CommonService) { }

ngOnInit(): void {
  this.getBrands()
}

addBrand(){
  let params = {
    name: this.name,
    bg: this.bg,
    img: this.img
  }
  this.isSaving = true
  this.commonService.addNewBrand(params).subscribe((res:any)=>{
    this.name = ''
    this.bg = ''
    this.img = ''
    this.isSaving = false
    this.getBrands()
  }, error => {
    console.log(error)
    this.isSaving = false
  })
}

getBrands(){
  this.isLoading = true
  this.commonService.getGroceryBrands().subscribe((res:any)=>{
    this.brands = res.data
    this.isLoading = false
  }, error => {
    console.log(error)
    this.isLoading = false
  })
}

selectBrand(brand: any){
  this.mode = 'update'
  this.name = brand.name
  this.bg = brand.bg
  this.img = brand.img
  this.selectedBrandId = brand.id
}

updateBrand(){
  let params = {
    name: this.name,
    bg: this.bg,
    img: this.img
  }
  this.isSaving = true
  this.commonService.updateBrand(this.selectedBrandId, params).subscribe((res:any)=>{
    this.name = ''
    this.bg = ''
    this.img = ''
    this.mode = 'add'
    this.isSaving = false
    this.getBrands()
  }, error => {    console.log(error)
      this.isSaving = false
  })
}

deleteBrand(){
  this.commonService.deleteBrand(this.selectedBrandId).subscribe((res:any)=>{
    this.name = ''
    this.bg = ''
    this.img = ''
    this.mode = 'add'
    this.getBrands()
  }, error => {    console.log(error)
  })
}
}
