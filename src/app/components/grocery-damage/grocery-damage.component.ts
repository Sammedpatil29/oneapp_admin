import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import { LoaderComponent } from "../loader/loader.component";
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { title } from 'process';

@Component({
  selector: 'app-grocery-damage',
  templateUrl: './grocery-damage.component.html',
  imports: [ CommonModule, FormsModule, LoaderComponent, EmptyDataComponent],
  styleUrls: ['./grocery-damage.component.css']
})
export class GroceryDamageComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  // Dummy data for available items to select from
  availableItems:any = [];

  filteredItems: any[] = [];
  searchTerm: string = '';
  isEditing: boolean = false;
  isGettingDamagedItems: boolean = false;
  editingId: number | null = null;

  // New item form model
  newItem: any = {
    itemId: '',
    name: '',
    reason: '',
    quantity: 1,
    acknowledged: false
  };

  // Dummy JSON data for the right panel list
  damagedItems: any[] = [];

  constructor(@Optional() private dialogRef: MatDialogRef<GroceryDamageComponent>, private commonService: CommonService) {}

  ngOnInit() {
    this.getGroceryDamageItems();
    this.getGroceryItems();
  }

  getGroceryDamageItems(){
    this.isGettingDamagedItems = true;
    this.commonService.getDamageItems().subscribe((res:any)=>{
      this.isGettingDamagedItems = false;
      this.damagedItems = res.data
    }, error =>{
      this.isGettingDamagedItems = false;
      console.log('failed to get damaged items')
    })
  }

  setItem(id:any){
    this.availableItems.filter((item:any)=>{
      if(item.id == id){
        this.newItem.itemId = item.id
        this.newItem.name = item.name
      }
    })
  }

  getGroceryItems(){
    let params = {
      token: sessionStorage.getItem('token'),
    };
    this.commonService.getGroceryList(params).subscribe((res:any)=>{
      let data = res.data
      this.availableItems = data.map((item:any)=>{
        return {
          id: item.id,
          name: item.name
        }
      })
      this.filteredItems = [...this.availableItems];
    }, error => {
      console.log('failed to get grocery items')
    })
  }

  filterItems() {
    if (!this.searchTerm) {
      this.filteredItems = [...this.availableItems];
    } else {
      this.filteredItems = this.availableItems.filter((item:any) => 
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  // Appends the form data to our dummy list
  addDamagedItem() {
    this.setItem(this.newItem.itemId)
    if (this.isEditing && this.editingId !== null) {
      let params = {
        id: this.editingId,
        itemId: this.newItem.itemId,
        name: this.newItem.name,
        reason: this.newItem.reason,
        quantity: this.newItem.quantity,
        acknowledged: this.newItem.acknowledged
      }
      this.commonService.updateDamage(params).subscribe((res:any)=>{
        this.getGroceryDamageItems()
      }, error => {
        console.log('failed to update damaged item')
      })
    } else {
      let params = {
        itemId: this.newItem.itemId,
        name: this.newItem.name,
        reason: this.newItem.reason,
        quantity: this.newItem.quantity,
        acknowledged: this.newItem.acknowledged
      }
      this.commonService.createDamage(params).subscribe((res:any)=>{
        this.getGroceryDamageItems()
      }, error => {
        console.log('failed to add damaged item')
      })
    }

    this.resetForm();
  }

  editItem(item: any) {
    this.isEditing = true;
    this.editingId = item.id;
    this.newItem = {
      itemId: item.itemId,
      reason: item.reason,
      quantity: item.quantity,
      acknowledged: item.acknowledged
    };
  }

  resetForm() {
    this.isEditing = false;
    this.editingId = null;
    this.newItem = {
      itemId: '',
      reason: '',
      quantity: 1,
      acknowledged: false
    };
  }

  deleteItem(id:any){
    this.dialog.open(AlertdialogComponent, {
      data:{
        title: 'warning',
        body: 'Are you sure you want to delete this item?',
        type: 'warning'
      }
    }).afterClosed().subscribe((res:any)=>{
      if(res == true || res == 'true'){
        this.commonService.deleteDamage(id).subscribe((res:any)=>{
          this.getGroceryDamageItems()
          this.dialog.open(AlertdialogComponent, {
      data:{
        title: 'success',
        body: 'Damage Entry deleted Successfully',
        type: 'success'
      }
    })
    }, error => {
      this.dialog.open(AlertdialogComponent, {
      data:{
        title: 'error',
        body: 'Error while deleting damage entry',
        type: 'error'
      }
    })
    })
  }
  })
}

  close() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
  
