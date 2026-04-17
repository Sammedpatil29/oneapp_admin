import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class ComplaintsComponent implements OnInit, OnChanges {
  readonly dialog = inject(MatDialog);
  @Input() searchTerm: string = '';
  
  supportTickets:any = []
  filteredTickets:any = []
  isLoading: boolean = false

  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getAllTickets()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchTerm'] && !changes['searchTerm'].firstChange) {
      this.filterTickets();
    }
  }

  getAllTickets(){
    let params = {
      "token": sessionStorage.getItem('token')
    }
    if(this.filteredTickets.length > 0){
      this.isLoading = false
    } else {
      this.isLoading = true
    }
    this.commonService.getAllSupportTickets(params).subscribe(res => {
        this.supportTickets = res;
        this.filterTickets();
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

  filterTickets(): void {
    if (!this.searchTerm) {
      this.filteredTickets = [...this.supportTickets.reverse()];
    } else {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      this.filteredTickets = this.supportTickets.filter((ticket: any) =>
        (ticket.subject && ticket.subject.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (ticket.user_name && ticket.user_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (ticket.status && ticket.status.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (ticket.ticket_id && ticket.ticket_id.toString().toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
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
            this.getAllTickets()
         }
         console.log(`Dialog result: ${result}`);
       });
 }

}
