import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { OrdersService } from '../../services/orders.service';
import { MatFormField, MatLabel } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";

@Component({
  selector: 'app-grocery-order-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormField, MatLabel, MatSelect, MatOption, ButtonSpinnerComponent],
  templateUrl: './grocery-order-details.component.html',
  styleUrl: './grocery-order-details.component.css'
})
export class GroceryOrderDetailsComponent implements OnInit {
  order: any;
  riders:any = []
  isAssigning: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<GroceryOrderDetailsComponent>, private ordersService: OrdersService) {
    this.order = data.order;
  }

  ngOnInit(): void {
    this.getRiders();
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
    let params = {
      "orderId": this.order.id,
    }
    this.ordersService.cancelOrder(params).subscribe((res:any)=>{
      this.dialogRef.close();
    })
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

  getRiders(){
    this.ordersService.getRiders().subscribe((res:any)=>{
      let onlineRiders = res
      this.riders = [];
      onlineRiders.forEach((rider:any)=>{
        this.riders.push({
          id: rider.id,
          name: rider.name
        })
      })
      console.log(this.riders)
    })
    
  } 

  assignRider(rider:any){
    let params = {
      "orderId": this.order.id,
      "riderId": rider
    }
    this.isAssigning = true
    this.ordersService.assignRider(params).subscribe((res:any)=>{
      this.order.raider_details = res.data.raider_details
      // this.order.rider_details.name = order.raider_details.name
      // this.order.rider_details.contact = order.raider_details.contact
      // this.order.rider_details.vehicle_number = order.raider_details.vehicle_number
      this.isAssigning = false
    }, error => {
      this.isAssigning = false
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
