import { Component, inject, Input, input, OnInit } from '@angular/core';
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { CommonService } from '../../services/common.service';
import { LoaderComponent } from "../loader/loader.component";
import { CommonModule } from '@angular/common';

import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

@Component({
  selector: 'app-complaints',
  imports: [EmptyDataComponent, LoaderComponent, CommonModule],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  @Input() searchTerm: string = '';
  
  supportTickets:any = []
  filteredTickets:any = []
  isLoading: boolean = false

  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getAllTickets()
  }

  getAllTickets(){
    let params = {
      "token": sessionStorage.getItem('token')
    }
    this.isLoading = true
    this.commonService.getAllSupportTickets(params).subscribe(res => {
        this.supportTickets = res
        this.filteredTickets = this.supportTickets.reverse()
        this.isLoading = false
    }, error => {
      this.isLoading = false
      this.dialog.open(AlertdialogComponent, {
                  data: {
                    title: 'error',
                    body: 'Failed to fetch tickets',
                    type: 'error',
                  },
                });
    })
  }

 viewTicket(item:any){
   const dialogRef = this.dialog.open(TicketDialogComponent, {
         data: { 
          type: 'view',
          item: item
         },
         maxWidth: '50vw',
       });
   
       dialogRef.afterClosed().subscribe((result) => {
         if (result == undefined || result == 'true') {
           // this.getAllGroceryList();
         }
         console.log(`Dialog result: ${result}`);
       });
 }

}
