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
  filteredTickets:any = [
  {
    "ticket_id": "TCK-1001",
    "orderId": "ORD-99821",
    "title": "Database connection timeout in production server",
    "details": "The application server throws a 504 gateway timeout every time it tries to connect to the replica node during high traffic periods.",
    "assignee": {
      "name": "Sarah Connor",
      "role": "DevOps Engineer",
      "avatar_url": "assets/avatars/sarah.jpg"
    },
    "status": [
      {
        "status": "Open",
        "time": "2026-05-20T08:30:00.000Z"
      }
    ],
    "created_at": "2026-05-20T08:30:00.000Z",
    "closed_at": null,
    "svg": "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"
  },
  {
    "ticket_id": "TCK-1002",
    "orderId": "ORD-55412",
    "title": "Password reset email not sending",
    "details": "Users are reporting that they do not receive the recovery link when requesting a password reset.",
    "assignee": {
      "name": "Alex Mercer",
      "role": "Tier 2 Support",
      "avatar_url": "assets/avatars/alex.jpg"
    },
    "status": [
      {
        "status": "Open",
        "time": "2026-05-18T14:15:22.000Z"
      },
      {
        "status": "In Progress",
        "time": "2026-05-18T16:40:00.000Z"
      },
      {
        "status": "Closed",
        "time": "2026-05-19T10:00:00.000Z"
      }
    ],
    "created_at": "2026-05-18T14:15:22.000Z",
    "closed_at": "2026-05-19T10:00:00.000Z",
    "svg": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
  },
  {
    "ticket_id": "TCK-1003",
    "orderId": "ORD-11029",
    "title": "Minor styling glitch on mobile view layout",
    "details": "",
    "assignee": null,
    "status": [
      {
        "status": "Open",
        "time": "2026-05-22T11:05:00.000Z"
      }
    ],
    "created_at": "2026-05-22T11:05:00.000Z",
    "closed_at": null,
    "svg": "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
  }
]
  isLoading: boolean = false

  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      // this.getAllTickets()
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
