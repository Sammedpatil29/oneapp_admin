import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatDatepickerToggle, MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";

@Component({
  selector: 'app-orders-layout',
  imports: [RouterOutlet, MatFormField, MatLabel, MatDatepickerToggle, MatDatepicker, MatDatepickerModule],
  templateUrl: './orders-layout.component.html',
  styleUrl: './orders-layout.component.css'
})
export class OrdersLayoutComponent {
  isDropdownOpen: boolean = false;
  selectedOption: string = 'Grocery';

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }
}
