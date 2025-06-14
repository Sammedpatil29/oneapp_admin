import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { LoaderComponent } from '../loader/loader.component';
import { FormsModule } from '@angular/forms';
import { EmptyDataComponent } from '../empty-data/empty-data.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grocery',
  imports: [LoaderComponent, FormsModule, EmptyDataComponent, CommonModule],
  templateUrl: './grocery.component.html',
  styleUrl: './grocery.component.css'
})
export class GroceryComponent implements OnInit{
groceryList: any;
fullGroceryList: any;
view = 'table'
isLoading: boolean  = false
searchTerm = ''
constructor(private commonService: CommonService){}

ngOnInit(): void {
    this.getAllGroceryList()
}

getAllGroceryList(){
  let params = {
    "token": sessionStorage.getItem('token')
  }
  this.isLoading = true
  this.commonService.getGroceryList(params).subscribe((res)=>{
    this.fullGroceryList = res
    this.groceryList = this.fullGroceryList
    this.isLoading = false
    console.log(this.groceryList)
  }, error => {
    this.isLoading = false
  })
}

getAvailability(value:any){
  if(value == true){
    return "Available"
  } else {
    return "Out of Stock"
  }
}

searchItems() {
  console.log('called search terams')
  const term = this.searchTerm.trim().toLowerCase();
  this.groceryList = this.fullGroceryList.filter((item: any) => {
    return item.name.toLowerCase().includes(term) || item.brand.toLowerCase().includes(term) || item.category.toLowerCase().includes(term);
  });
}

getStockColor(count:any){
  if(count < 10){
    return 'text-danger'
  } else {
    return 'text-dark'
  }
}
}
