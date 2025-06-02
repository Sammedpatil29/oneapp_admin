import { Component } from '@angular/core';
import { EmptyDataComponent } from "../empty-data/empty-data.component";

@Component({
  selector: 'app-orders',
  imports: [EmptyDataComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
orders = []
}
