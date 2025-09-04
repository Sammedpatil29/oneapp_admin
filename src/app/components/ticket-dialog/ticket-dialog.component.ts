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
  "token": sessionStorage.getItem('token'),
  "user": 3,
  "title": this.title,
  "details": this.description,
  "ticket_id": ticket_id,
  "connected_by": 'backend',
  "status": "Open"
  }
  this.isLoading = true
  this.commonService.createSupportTickets(params).subscribe((res:any)=>{
    this.isLoading = false
    this.dialogRef.close();
    this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'success',
              body: `${res.ticket_id} Raised Successfully`,
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
  if(this.comment.length < 15){
    this.showCommentBox = !this.showCommentBox
  } else {
    let params = {
      "token": sessionStorage.getItem('token'),
      "connected_by": 'backend',
      "status": "Closed",
      "closed_at": new Date().toISOString(),
      "comment": this.comment
    }
    this.isLoading = true
    this.commonService.updateSupportTickets(params, this.data.item.id).subscribe(res => {
      this.isLoading = false
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

close(){
  this.dialogRef.close();
}

clickCount = 0
deleteTicket(id:any){
  if(this.clickCount != 10){
    this.clickCount += 1
    console.log(this.clickCount)
  } else {
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
}
}
