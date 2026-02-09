import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { OrdersService } from '../../services/orders.service';
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";

@Component({
  selector: 'app-grocery-order-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormField, MatLabel, MatSelect, MatOption],
  templateUrl: './grocery-order-details.component.html',
  styleUrl: './grocery-order-details.component.css'
})
export class GroceryOrderDetailsComponent {
  order: any;
  riders = ['sudu','kallappa','mallappa']
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<GroceryOrderDetailsComponent>, private ordersService: OrdersService) {
    this.order = data.order;
  }

  getStatusClass(status: string): string {
    if (!status) return 'bg-secondary text-white';
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-primary text-white';
      case 'pending': return 'bg-warning text-dark';
      case 'delivered': return 'bg-success text-white';
      case 'cancelled': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  cancelOrder() {
    // TODO: Implement cancel order logic
  }

  markPacked() {
    let params = {
      "orderId": this.order.id,
    "status": "PACKED"
    }
    this.ordersService.updateOrder(params).subscribe((res:any)=>{
      this.dialogRef.close();
    })
  }

  assignRider(rider:any){}
}
