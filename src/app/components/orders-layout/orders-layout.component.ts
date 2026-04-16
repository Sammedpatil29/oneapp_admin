import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-orders-layout',
  imports: [RouterOutlet],
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
