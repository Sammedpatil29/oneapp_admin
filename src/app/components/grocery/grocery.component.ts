import { Component, inject, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule } from '@angular/forms';
import { EmptyDataComponent } from '../empty-data/empty-data.component';
import { CommonModule } from '@angular/common';
import { AddGroceryComponent } from '../add-grocery/add-grocery.component';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

@Component({
  selector: 'app-grocery',
  imports: [LoaderComponent, FormsModule, EmptyDataComponent, CommonModule],
  templateUrl: './grocery.component.html',
  styleUrl: './grocery.component.css',
})
export class GroceryComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  groceryList: any;
  fullGroceryList: any;
  view = 'table';
  isLoading: boolean = false;
  searchTerm = '';
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.getAllGroceryList();
  }

  getAllGroceryList() {
    let params = {
      token: sessionStorage.getItem('token'),
    };
    this.isLoading = true;
    this.commonService.getGroceryList(params).subscribe(
      (res) => {
        this.fullGroceryList = res;
        this.groceryList = this.fullGroceryList;
        this.isLoading = false;
        console.log(this.groceryList);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  getAvailability(value: any) {
    if (value == true) {
      return 'Available';
    } else {
      return 'Out of Stock';
    }
  }

  searchItems() {
    this.lowSet = false
    const term = this.searchTerm.trim().toLowerCase();
    this.groceryList = this.fullGroceryList.filter((item: any) => {
      return (
        item.name.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    });
  }

  getStockColor(count: any) {
    if (count < 10) {
      return 'text-danger';
    } else {
      return;
    }
  }

  getStatusColor(status: any) {
    if (status == true) {
      return 'text-success';
    } else {
      return 'text-danger';
    }
  }

  addNewItem() {
    const dialogRef = this.dialog.open(AddGroceryComponent, {
      data: { type: 'add' },
      maxWidth: '75vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined || result == 'true') {
        this.getAllGroceryList();
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(item: any) {
    const dialogRef = this.dialog.open(AddGroceryComponent, {
      data: { item: item, type: 'edit' },
      maxWidth: '75vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined || result == 'true') {
        this.getAllGroceryList();
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  lowSet = false;
  showLowInventory() {
    if (this.lowSet == false) {
      const value = this.fullGroceryList.filter((item: any) => {
        return item.stock < 10;
      });
      this.groceryList = value;
      this.lowSet = true;
    } else {
      this.groceryList = this.fullGroceryList;
      this.lowSet = false;
    }
  }

  flattenForExport(obj: any): any {
  return {
    name: obj.name,
    quantity: `${obj.quantity.amount}${obj.quantity.unit}`,
    price_mrp: obj.price?.mrp ?? '',
    price_ourPrice: obj.price?.ourPrice ?? '',
    stock: obj.stock ?? '',

  };
}

exportToExcel(): void {
  const exportList = this.groceryList.map((item: any) => this.flattenForExport(item));
  if(exportList.length > 0){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportList);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Grocery List');

  const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });
  const date = new Date().toLocaleDateString()
  FileSaver.saveAs(data, `Grocery_List_${date}.xlsx`);
  } else {
    this.dialog.open(AlertdialogComponent, {
      data: {
        title: 'error',
        body: 'No Data to Export',
        type: 'error',
      },
    });
  }
}

}
