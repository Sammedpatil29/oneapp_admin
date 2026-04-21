import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatDatepickerToggle, MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { OrdersSearchService } from '../../services/orders-search.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-orders-layout',
  imports: [
    RouterOutlet, 
    FormsModule, 
    MatFormField, 
    MatLabel, 
    MatDatepickerToggle, 
    MatDatepicker, 
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './orders-layout.component.html',
  styleUrl: './orders-layout.component.css'
})
export class OrdersLayoutComponent implements OnInit{
  isDropdownOpen: boolean = false;
  selectedOption: string = 'Grocery';
  searchTerm: string = '';
  startDate: Date | null = new Date();
  endDate: Date | null = new Date();
  maxDate: Date = new Date(); // Restricts selection to today or earlier, adjust as needed
  services: any[] = []
  constructor(private searchService: OrdersSearchService, private commonService: CommonService) {}

  ngOnInit(): void {
    this.onDateChange(null)
    this.getServices()
  }

  onSearchChange(term: string) {
    this.searchService.setSearchTerm(term);
  }

  onDateChange(event: any) {
    let startEpoch: number | null = null;
    let endEpoch: number | null = null;

    if (this.startDate) {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      startEpoch = start.getTime();
    }

    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      endEpoch = end.getTime();
    }

    this.searchService.setDateRange(startEpoch, endEpoch);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

  getServices(){
    this.commonService.getServices().subscribe((res:any)=>{
      this.services = res.data
    }, error => {
      console.log(error)
    })
  }
}
