import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from "@angular/material/input";
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { c } from "../../../../node_modules/@angular/cdk/a11y-module.d-DBHGyKoh";
import { SendEmailComponent } from '../send-email/send-email.component';
import { RefundExchangeComponent } from '../refund-exchange/refund-exchange.component';
import { GroceryOrderDetailsComponent } from '../grocery-order-details/grocery-order-details.component';

@Component({
  selector: 'app-ticket-dialog',
  imports: [MatDialogContent, MatInputModule, MatInputModule, MatDialogModule, ButtonSpinnerComponent, FormsModule, CommonModule],
  templateUrl: './ticket-dialog.component.html',
  styleUrl: './ticket-dialog.component.css'
})
export class TicketDialogComponent implements OnInit{
  readonly dialog = inject(MatDialog);
isLoading:boolean = false
itemUpdating:boolean = false
gettingOrderDetails:boolean = false
isDeleting:boolean = false
title: any = ''
description: any = ''
userNumber: any = ''
comment: any = ''
isViewTicket: boolean = true
showCommentBox: boolean = false
token: any = ''
role: any = ''

constructor(@Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService, private dialogRef: MatDialogRef<TicketDialogComponent>){}

ngOnInit(): void {
    this.token = sessionStorage.getItem('token')
                const decoded = jwtDecode<any>(this.token)
                this.role = decoded.role
}

createTicket(){
  let ticket_id = `TKT${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 100)}`
  let params = {
  "title": this.title,
  "details": this.description,
  "phone": this.userNumber,
  }
  this.isLoading = true
  this.commonService.createSupportTickets(params).subscribe((res:any)=>{
    this.isLoading = false
    this.dialogRef.close();
    this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'success',
              body: `${res.data.ticket_id} Raised Successfully`,
              type: 'success',
            },
          });
  }, error => {
    this.isLoading = false
    this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'error',
              body: 'Failed to raise ticket',
              type: 'error',
            },
          });
  })
}

closeTicket(){
  if(this.comment.length == 0){
    this.showCommentBox = !this.showCommentBox
  } else {
    let params = {
      status: [...this.data.item.status, {status: 'Closed', date: new Date()}],
      closed_at: new Date(),
      comment: [...this.data.item.comment, {comment: this.comment, date: new Date()}]
    }
    this.isLoading = true
    this.commonService.updateSupportTickets(params, this.data.item.id).subscribe(res => {
      this.isLoading = false
      this.comment = ''
    this.dialogRef.close();
    this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'success',
              body: `${this.data.item.ticket_id} Resolved Successfully`,
              type: 'success',
            },
          });
    }, error => {
      this.isLoading = false
    this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'error',
              body: 'Failed to Resolve ticket',
              type: 'error',
            },
          });
    })
  }
}

addComment(){
  if(this.comment.length == 0){
    this.showCommentBox = !this.showCommentBox
  } else {
    let params = {
      comment: [...this.data.item.comment, {comment: this.comment, date: new Date()}]
    }
    this.isLoading = true
    this.commonService.updateSupportTickets(params, this.data.item.id).subscribe(res => {
      this.isLoading = false
      this.comment = ''
    this.dialogRef.close();
    this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'success',
              body: `Comment added Successfully`,
              type: 'success',
            },
          });
    }, error => {
      this.isLoading = false
    this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'error',
              body: 'Failed to add comment',
              type: 'error',
            },
          });
    })
  }
}

close(){
  this.dialogRef.close();
}

clickCount = 0
deleteTicket(id:any){

  this.dialog.open(AlertdialogComponent, {
    data: {
              title: 'warning',
              body: `Are you sure you want to delete?`,
              type: 'warning',
            },
  }).afterClosed().subscribe(res => {
    if(res == 'true' || res == true){
      let params = {
      "token": sessionStorage.getItem('token')
    }
    this.isDeleting = true
    this.commonService.deleteSupportTickets(params, id).subscribe(res => {
      this.isDeleting = false
      this.dialogRef.close();
      this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'success',
              body: `${this.data.item.ticket_id} deleted successfully`,
              type: 'success',
            },
          });

    }, error => {
      this.isDeleting = false
      this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'error',
              body: `Failed to delete ${this.data.item.ticket_id}`,
              type: 'error',
            },
          });
    })
    }
  })
  }

  sendEmail(){
    this.dialog.open(SendEmailComponent, {
      minWidth: '50vw',
      data: {
        email: this.data.item.userDetails.email,
      }
    })
  }

  refund(){
    this.dialog.open(RefundExchangeComponent, {
      minWidth: '50vw',
      data: {
        email: this.data.item.user_email,
      }
    })
  }

  checkOrder(){
    this.gettingOrderDetails = true
    this.commonService.getAdminOrderById(this.data.item.orderId, this.data.item.orderService).subscribe((res:any)=>{
      this.gettingOrderDetails = false
      try {
          const dialogRef = this.dialog.open(GroceryOrderDetailsComponent, {
            width: '90%',
            maxWidth: '80vw',
            maxHeight: '90vh',
            autoFocus: false,
            data: {
              title: 'Order Details',
              order: res.data
            },
            disableClose: true
          });
      
        } catch (error) {
          // Fallback 3: Component Load Failure
          this.gettingOrderDetails = false
          console.error('Failed to open Order Details dialog:', error);
        }
    }, error => {
      this.gettingOrderDetails = false
      this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'error',
              body: `Failed to fetch order details`,
              type: 'error',
            },
          });
    })
  }
}
