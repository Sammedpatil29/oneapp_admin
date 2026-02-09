import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders.service';
import { CommonService } from '../../services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

@Component({
  selector: 'app-grocery-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grocery-orders.component.html',
  styleUrls: ['./grocery-orders.component.css']
})
export class GroceryOrdersComponent implements OnInit {
  
  // Data initialized from your provided JSON
  orders: any[] = [];

  constructor(private ordersService: OrdersService, private dialog: MatDialog){

  }

  ngOnInit() {
    this.getOrders()
  }

  getOrders(){
    this.ordersService.getOrders('grocery').subscribe((res:any)=>{
      this.orders = res.data
    })
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-default';
    switch (status.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  }

  viewOrder(id:any){
    this.dialog.open(AlertdialogComponent, {
      data: {
        title: 'Order Details',
        body: `Viewing details for Order #${id}`,
        id: id
      }
    });
  }
}