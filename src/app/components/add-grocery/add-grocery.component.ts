import {ChangeDetectionStrategy, Component, Inject, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";

@Component({
  selector: 'app-add-grocery',
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, ButtonSpinnerComponent],
  templateUrl: './add-grocery.component.html',
  styleUrl: './add-grocery.component.css'
})
export class AddGroceryComponent implements OnInit{

  name = ''
  category = ''
  description = ''
  brand = ''
  qAmount = ''
  unit = ''
  mrp = ''
  ourPrice = ''
  dAmount = ''
  dType = ''
  d_valid_untill = ''
  stock = ''
  newStock = ''
  image_url = ''
  is_available = true
  rating = ''
  tags = []
  created_at = ''
  updated_at = ''
  isLoading: boolean = false
  itemUpdating: boolean = false
  isDeleting: boolean = false

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService, private dialogRef: MatDialogRef<AddGroceryComponent>){
    console.log(data)
  }

  ngOnInit(): void {
      if(this.data.type == 'edit'){
      this.name = this.data.item.name
      this.category = this.data.item.category
      this.description = this.data.item.description
      this.brand = this.data.item.brand
      this.qAmount = this.data.item.quantity.amount
      this.unit = this.data.item.quantity.unit
      this.mrp = this.data.item.price.mrp
      this.ourPrice = this.data.item.price.ourPrice
      this.dAmount = this.data.item.discount.amount
      this.stock = this.data.item.stock
      this.image_url = this.data.item.image_url
      this.is_available = this.data.item.is_available

    }
  }

  createGroceryList(){
    let params = {
      "token": sessionStorage.getItem('token'),
    "name": this.name,
    "category": this.category,
    "description": this.description,
    "brand": this.brand,
    "quantity": {
      "amount": this.qAmount,
      "unit": this.unit
    },
    "price": {
      "mrp": this.mrp,
      "ourPrice": this.ourPrice
    },
    "discount": {
      "amount": this.dAmount,
      "type": this.dType,
    },
    "stock": this.stock,
    "image_url": this.image_url,
    "is_available": true,
    "rating": '4.6',
    "tags": ['grocery']
    }
    this.isLoading = true
    this.commonService.createGroceryItem(params).subscribe((res)=>{
      alert('Item added successfully')
      this.isLoading = false
      this.dialogRef.close();
    }, error => {
      this.isLoading = false
      alert('error creating item')
    })
  }

  updateGroceryList(){
    let params = {
      "token": sessionStorage.getItem('token'),
    "name": this.name,
    "category": this.category,
    "description": this.description,
    "brand": this.brand,
    "quantity": {
      "amount": this.qAmount,
      "unit": this.unit
    },
    "price": {
      "mrp": this.mrp,
      "ourPrice": this.ourPrice
    },
    "discount": {
      "amount": this.dAmount,
      "type": this.dType,
    },
    "stock": this.stock,
    "image_url": this.image_url,
    "is_available": true,
    "rating": '4.6',
    "tags": ['grocery']
    }
    this.itemUpdating = true
    this.commonService.updateGroceryItem(this.data.item.id,params).subscribe((res)=>{
      alert('Item updated successfully')
      this.itemUpdating = false
      this.dialogRef.close();
    }, error => {
      this.itemUpdating = false
      alert('error while updating item')
    })
  }

  count = 0
  deleteGroceryItem(){
    let params = {
      "token": sessionStorage.getItem('token')
    }
    this.count = this.count + 1
    if(this.count == 10){
      this.isDeleting = true
      this.commonService.deleteGroceryItem(this.data.item.id, params).subscribe(res=>{
        alert('item deleted successfully')
        this.isDeleting = false
        this.dialogRef.close();
      }, error => {
        this.isDeleting = false
        alert('error while deleting item')
      })
    }

  }

  // updateStock(){
  //   this.stock = String(Number(this.newStock) + Number(this.stock))
  // }
}
