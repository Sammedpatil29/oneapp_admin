import {ChangeDetectionStrategy, Component, Inject, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

@Component({
  selector: 'app-add-grocery',
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, ButtonSpinnerComponent],
  templateUrl: './add-grocery.component.html',
  styleUrl: './add-grocery.component.css'
})
export class AddGroceryComponent implements OnInit{
readonly dialog = inject(MatDialog);
  name = ''
  category = ''
  description = ''
  brand = ''
  unit_value = ''
  unit = ''
  price = ''
  discount = ''
  stock = ''
  image_url = ''
  is_active = true
  tags = ''
  sku = ''
  min_quantity = 1
  max_quantity = 5
  nutritional_info = ''
  is_featured = false
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
      this.unit_value = this.data.item.unit_value
      this.unit = this.data.item.unit
      this.price = this.data.item.price
      this.discount = this.data.item.discount
      this.stock = this.data.item.stock
      this.image_url = this.data.item.image_url
      this.is_active = this.data.item.is_active
      this.sku = this.data.item.sku
      this.min_quantity = this.data.item.min_quantity
      this.max_quantity = this.data.item.max_quantity
      this.nutritional_info = this.data.item.nutritional_info
      this.is_featured = this.data.item.is_featured
      this.tags = this.data.item.tags ? this.data.item.tags.join(', ') : ''
    }
  }

  createGroceryList(){
    let params = {
      "token": sessionStorage.getItem('token'),
    "name": this.name,
    "category": this.category,
    "description": this.description,
    "brand": this.brand,
    "unit_value": this.unit_value,
    "unit": this.unit,
    "price": this.price,
    "discount": this.discount,
    "stock": this.stock,
    "image_url": this.image_url,
    "is_active": this.is_active,
    "tags": this.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
    "sku": this.sku,
    "min_quantity": this.min_quantity,
    "max_quantity": this.max_quantity,
    "nutritional_info": this.nutritional_info,
    "is_featured": this.is_featured
    }
    this.isLoading = true
    this.commonService.createGroceryItem(params).subscribe((res)=>{
      // alert('Item added successfully')
      this.dialog.open(AlertdialogComponent, {
        data: {
          title: 'success',
          body: 'Item added successfully',
          type: 'success',
        },
      });

      this.isLoading = false;
      this.dialogRef.close();
    }, error => {
      this.isLoading = false
     this.dialog.open(AlertdialogComponent, {
        data: {
          title: 'error',
          body: 'Error while adding Item',
          type: 'error',
        },
      });
    })
  }

  updateGroceryList(){
    let params = {
      "token": sessionStorage.getItem('token'),
    "name": this.name,
    "category": this.category,
    "description": this.description,
    "brand": this.brand,
    "unit_value": this.unit_value,
    "unit": this.unit,
    "price": this.price,
    "discount": this.discount,
    "stock": this.stock,
    "image_url": this.image_url,
    "is_active": this.is_active,
    "tags": this.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
    "sku": this.sku,
    "min_quantity": this.min_quantity,
    "max_quantity": this.max_quantity,
    "nutritional_info": this.nutritional_info,
    "is_featured": this.is_featured
    }
    this.itemUpdating = true
    this.commonService.updateGroceryItem(this.data.item.id,params).subscribe((res)=>{
      this.dialog.open(AlertdialogComponent, {
        data: {
          title: 'success',
          body: 'Item updated successfully',
          type: 'success',
        },
      });
      this.itemUpdating = false
      this.dialogRef.close();
    }, error => {
      this.itemUpdating = false
      this.dialog.open(AlertdialogComponent, {
        data: {
          title: 'error',
          body: 'Failed to update Item',
          type: 'error',
        },
      });
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
        this.dialog.open(AlertdialogComponent, {
        data: {
          title: 'success',
          body: 'Item deleted successfully',
          type: 'success',
        },
      });
        this.isDeleting = false
        this.dialogRef.close();
      }, error => {
        this.isDeleting = false
        this.dialog.open(AlertdialogComponent, {
        data: {
          title: 'error',
          body: 'Failed to delete Item',
          type: 'error',
        },
      });
      })
    }

  }

  // updateStock(){
  //   this.stock = String(Number(this.newStock) + Number(this.stock))
  // }
}
