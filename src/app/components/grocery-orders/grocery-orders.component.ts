import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders.service';
import { CommonService } from '../../services/common.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { GroceryOrderDetailsComponent } from '../grocery-order-details/grocery-order-details.component';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-grocery-orders',
  standalone: true,
  imports: [CommonModule, MatDialogModule, LoaderComponent],
  templateUrl: './grocery-orders.component.html',
  styleUrls: ['./grocery-orders.component.css']
})
export class GroceryOrdersComponent implements OnInit {
  
  // Data initialized from your provided JSON
  orders: any[] = [];
  isLoading: boolean = false


  constructor(private ordersService: OrdersService, private dialog: MatDialog){

  }

  ngOnInit() {
    this.getOrders()
  }

  getOrders(){
    this.isLoading = true
    this.ordersService.getOrders('grocery').subscribe((res:any)=>{
      this.orders = res.data
      this.isLoading = false

    }, error => {
      this.isLoading = false
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

  viewOrder(order: any) {
  // Fallback 1: Input Validation
  console.log('called', order)
  const id = order.id || order._id
  if (!id) {
    console.error('Order ID is missing');
    return;
  }

  try {
    const dialogRef = this.dialog.open(GroceryOrderDetailsComponent, {
      width: '90%',
      maxWidth: '80vw',
      maxHeight: '90vh',
      autoFocus: false,
      data: {
        title: 'Order Details',
        body: `Viewing details for Order #${id}`,
        id: id,
        order: order
      }
    });

    // Fallback 2: Handle Dialog Close/Cancel
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        console.log('Dialog dismissed without action');
      } else {
        this.getOrders()
      }
    });

  } catch (error) {
    // Fallback 3: Component Load Failure
    console.error('Failed to open Order Details dialog:', error);
  }
}
}