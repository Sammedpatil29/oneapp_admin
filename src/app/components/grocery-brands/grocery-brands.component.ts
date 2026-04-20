import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogActions, MatDialogClose, MatDialogTitle } from "@angular/material/dialog";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-grocery-brands',
  imports: [MatDialogContent, MatFormField, MatLabel, FormsModule, MatDialogActions, MatInputModule, MatFormFieldModule, MatDialogClose, MatDialogTitle],
  templateUrl: './grocery-brands.component.html',
  styleUrl: './grocery-brands.component.css'
})
export class groceryBrandsComponent implements OnInit {
name: any;
bg: any;
img: any;
mode: any = 'add'
selectedBrandId: any;
brands: any[] = [
  {
    name: "Patanjali",
    img: "brand",
    bg: "#ffffff"
  },
  {
    name: "Tata",
    img: "brand",
    bg: "#ffffff"
  },
  {
    name: "Britannia",
    img: "brand",
    bg: "#ffffff"
  },
  {
    name: "Britannia",
    img: "brand",
    bg: "#ffffff"
  },
  {
    name: "Britannia",
    img: "brand",
    bg: "#ffffff"
  }
]

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
  this.commonService.addNewBrand(params).subscribe((res:any)=>{
    this.name = ''
    this.bg = ''
    this.img = ''
    this.getBrands()
  }, error => {
    console.log(error)
  })
}

getBrands(){
  this.commonService.getGroceryBrands().subscribe((res:any)=>{
    this.brands = res.data
  }, error => {
    console.log(error)
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
  this.commonService.updateBrand(this.selectedBrandId, params).subscribe((res:any)=>{
    this.name = ''
    this.bg = ''
    this.img = ''
    this.mode = 'add'
    this.getBrands()
  }, error => {    console.log(error)
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
