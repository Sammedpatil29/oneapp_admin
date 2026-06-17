import { Component, inject, Inject, OnInit } from '@angular/core';
import { UnderDevelopmentComponent } from "../under-development/under-development.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { LoaderComponent } from "../loader/loader.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-refund-exchange',
  imports: [UnderDevelopmentComponent, LoaderComponent, CommonModule],
  templateUrl: './refund-exchange.component.html',
  styleUrl: './refund-exchange.component.css'
})
export class RefundExchangeComponent implements OnInit{
  orderDetails:any;
  isLoading: boolean = false
  selectedItemsValue: number = 0;
  selectedItems: any[] = [];
  isExchangePossible: boolean = true;
  readonly dialog = inject(MatDialog);
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService, private dialogRef: MatDialogRef<RefundExchangeComponent>){}

ngOnInit(): void {
  this.getOrderDetails(true)
}

getOrderDetails(reload:any){
  if(reload){
    this.isLoading = true
  }
  this.commonService.getAdminOrderById(this.data.orderId, 'grocery').subscribe((res:any)=>{
    this.isLoading = false
    this.orderDetails = res.data
  }, error => {
    this.isLoading = false
    this.dialog.open(AlertdialogComponent, {
      data: {
        title: 'error',
        body: `Failed to fetch order details`,
        type: 'error',
      },
    })
  })
}

  // Calculates the effective price using the proportional split logic
  getEffectivePrice(item: any): number {
    if (!this.orderDetails?.bill_details) return item.total;

    const itemTotal = parseFloat(this.orderDetails.bill_details.itemTotal) || 0;
    const couponDiscount = parseFloat(this.orderDetails.bill_details.couponDiscount) || 0;

    // If there is no discount, the effective price is just the item's total
    if (itemTotal === 0 || couponDiscount === 0) return item.total;

    // Calculate percentage share of the order value and apply discount
    const itemSharePercentage = item.total / itemTotal;
    const itemDiscount = itemSharePercentage * couponDiscount;

    return Number((item.total - itemDiscount).toFixed(2));
  }

  // Toggles an individual item row and recalculates the refund value
  toggleSelection(item: any): void {
    item.selected = !item.selected;
    this.calculateRefund();
  }

  // Toggles all items on/off via the table header checkbox
  toggleAll(event: any): void {
    const isChecked = event.target.checked;
    this.orderDetails?.cart_items?.forEach((item: any) => item.selected = isChecked);
    this.calculateRefund();
  }

  // Checks if all items are currently selected to bind to the top checkbox state
  isAllSelected(): boolean {
    if (!this.orderDetails?.cart_items || this.orderDetails.cart_items.length === 0) return false;
    return this.orderDetails.cart_items.every((item: any) => item.selected);
  }

  // Iterates selected items and updates the total refund state
  calculateRefund(): void {
    this.selectedItems = (this.orderDetails?.cart_items || []).filter((item: any) => item.selected);
    this.selectedItemsValue = this.selectedItems
      .reduce((sum: number, item: any) => sum + this.getEffectivePrice(item), 0);
    this.returnAndExchangeChecker();
  }

  returnAndExchangeChecker(): void {
    if (this.selectedItems.length === 0) {
      this.isExchangePossible = true; // Can't exchange 0 items, but don't show error state
      return;
    }
    // An exchange is not allowed if any selected item is out of stock.
    this.isExchangePossible = !this.selectedItems.some(item => item.stock === 0);
  }

  markRefund(){
    this.dialog.open(AlertdialogComponent, {
      data: {
        title: 'warning',
        body: `Before Processing Refund Hope you have manually PAID to the Customer?`,
        type: 'warning',
        }
    }).afterClosed().subscribe((res:any) => {
      if(res == 'true' || res == true){
        const allItems = (this.orderDetails?.cart_items || []).map((item: any) => {
      if (item.selected) {
        const existingMessages = Array.isArray(item.refund_message) ? item.refund_message : (item.refund_message ? [item.refund_message] : []);
        return {
          ...item,
          refund_message: [...existingMessages, `refund of rs ${this.getEffectivePrice(item)} is completed.`]
        };
      }
      return item;
    });

    let params = {
      status: 'refunded',
      orderId: this.data.orderId,
      service: 'grocery',
      items: allItems
    };
    this.commonService.updateAdminOrderById(params).subscribe((res:any)=>{
      this.getOrderDetails(false)
      this.dialog.open(AlertdialogComponent, {
        data: {
        title: 'success',
        body: `Refund Completed Successfully `,
        type: 'success',
      }
      })
    }, error => {
      this.dialog.open(AlertdialogComponent, {
        data: {
        title: 'error',
        body: `Refund Failed`,
        type: 'error',
      }
      })
    })
      }
    })
  }

  exchange(){
   this.dialog.open(AlertdialogComponent, {
    data: {
      title: 'warning',
      body: `Are you sure you want to exchange?`,
      type: 'warning',
    }
  }).afterClosed().subscribe((res:any)=>{
    if(res == 'true' || res == true){
      const allItems = (this.orderDetails?.cart_items || []).map((item: any) => {
      if (item.selected) {
        const existingMessages = Array.isArray(item.refund_message) ? item.refund_message : (item.refund_message ? [item.refund_message] : []);
        return {
          ...item,
          refund_message: [...existingMessages, `exchange initiated`]
        };
      }
      return item;
    });

    let params = {
      status: 'exchange started',
      orderId: this.data.orderId,
      service: 'grocery',
      items: allItems
    };
    this.commonService.updateAdminOrderById(params).subscribe((res:any)=>{
      this.getOrderDetails(false)
      this.dialog.open(AlertdialogComponent, {
        data: {
        title: 'success',
        body: `Exchange Initiated Successfully `,
        type: 'success',
      }
      })
    }, error => {
      this.dialog.open(AlertdialogComponent, {
        data: {
        title: 'error',
        body: `Exchange Initiation Failed`,
        type: 'error',
      }
      })
    })
    }
  })
}

  return(){
    this.dialog.open(AlertdialogComponent, {
      data: {
        title: 'warning',
        body: `Are you sure you want to return?`,
        type: 'warning',
      }
    }).afterClosed().subscribe((res:any) => {
      if(res == 'true' || res == true){
        const allItems = (this.orderDetails?.cart_items || []).map((item: any) => {
      if (item.selected) {
        const existingMessages = Array.isArray(item.refund_message) ? item.refund_message : (item.refund_message ? [item.refund_message] : []);
        return {
          ...item,
          refund_message: [...existingMessages, `return initiated`]
        };
      }
      return item;
    });

    let params = {
      status: 'return started',
      orderId: this.data.orderId,
      service: 'grocery',
      items: allItems
    };
    this.commonService.updateAdminOrderById(params).subscribe((res:any)=>{
      this.getOrderDetails(false)
      this.dialog.open(AlertdialogComponent, {
        data: {
        title: 'success',
        body: `Return Initiated Successfully `,
        type: 'success',
      }
      })
    }, error => {
      this.dialog.open(AlertdialogComponent, {
        data: {
        title: 'error',
        body: `Return Initiation Failed`,
        type: 'error',
      }
      })
    })
      }
  })
}

  close(){
    this.dialogRef.close()
  }
}
