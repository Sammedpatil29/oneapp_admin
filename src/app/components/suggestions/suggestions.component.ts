import { Component, inject, OnInit } from '@angular/core';
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";
import { ComplaintsComponent } from '../complaints/complaints.component';
import { MatDialog } from '@angular/material/dialog';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-suggestions',
  imports: [EmptyDataComponent, CommonModule, LoaderComponent, ComplaintsComponent, FormsModule],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css'
})
export class SuggestionsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  suggestions: any[] = [];
  payouts: any[] = [];
  filteredPayouts: any[] = [];
  isLoading: boolean = false;
  view = 'complaints';
  header = '';
  token: any = '';
  searchTerm: any = '';
  payoutFilterStatus: string = 'all';
  isProcessingPayoutId: string | null = null;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.token = sessionStorage.getItem('token');
    this.header = 'Support Tickets🎟️';
    this.getSuggestions();
  }

  getSuggestions() {
    let params = {
      "token": this.token
    };
    this.isLoading = true;
    this.suggestions = [];
    this.commonService.getSuggestions(params).subscribe((res: any) => {
      this.suggestions = res.reverse();
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }

  getPayoutRequests() {
    this.isLoading = true;
    this.payouts = [];
    this.commonService.getPayoutRequests().subscribe((res: any) => {
      this.isLoading = false;
      this.payouts = res?.data || [];
      this.filterPayouts();
    }, error => {
      this.isLoading = false;
      this.dialog.open(AlertdialogComponent, {
        data: {
          title: 'Error',
          body: 'Failed to fetch payout requests',
          type: 'error',
        },
      });
    });
  }

  filterPayouts() {
    let list = [...this.payouts];
    if (this.payoutFilterStatus && this.payoutFilterStatus !== 'all') {
      list = list.filter(p => p.status === this.payoutFilterStatus);
    }
    if (this.searchTerm) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(p => 
        (p.payout_id && p.payout_id.toLowerCase().includes(q)) ||
        (p.rider_name && p.rider_name.toLowerCase().includes(q)) ||
        (p.rider_phone && p.rider_phone.toLowerCase().includes(q)) ||
        (p.upi_id && p.upi_id.toLowerCase().includes(q)) ||
        (p.rider?.name && p.rider.name.toLowerCase().includes(q)) ||
        (p.rider?.contact && p.rider.contact.toLowerCase().includes(q))
      );
    }
    this.filteredPayouts = list;
  }

  changeView(view: any) {
    this.view = view;
    this.searchTerm = '';
    if (view === 'suggestions') {
      this.header = 'Suggestions';
      this.getSuggestions();
    } else if (view === 'payouts') {
      this.header = 'Payout Requests 💸';
      this.getPayoutRequests();
    } else {
      this.header = 'Support Tickets🎟️';
    }
  }

  approvePayout(item: any) {
    if (!confirm(`Are you sure you want to approve payout #${item.payout_id} for ₹${item.amount} to UPI: ${item.upi_id}?`)) {
      return;
    }

    this.isProcessingPayoutId = item.id;
    this.commonService.updatePayoutStatus(item.id, 'APPROVED', 'Approved by admin').subscribe({
      next: (res: any) => {
        this.isProcessingPayoutId = null;
        item.status = 'APPROVED';
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Payout Approved',
            body: `Payout request #${item.payout_id} of ₹${item.amount} has been marked as approved.`,
            type: 'success',
          },
        });
        this.filterPayouts();
      },
      error: (err: any) => {
        this.isProcessingPayoutId = null;
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Error',
            body: err?.error?.message || 'Failed to approve payout request',
            type: 'error',
          },
        });
      }
    });
  }

  rejectPayout(item: any) {
    const reason = prompt(`Enter rejection reason for payout #${item.payout_id} (amount ₹${item.amount} will be refunded to rider's wallet):`, 'Invalid UPI ID or verification issue');
    if (reason === null) return; // User cancelled

    this.isProcessingPayoutId = item.id;
    this.commonService.updatePayoutStatus(item.id, 'REJECTED', reason || 'Rejected by admin').subscribe({
      next: (res: any) => {
        this.isProcessingPayoutId = null;
        item.status = 'REJECTED';
        item.admin_notes = reason;
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Payout Rejected',
            body: `Payout #${item.payout_id} rejected. ₹${item.amount} has been refunded to the rider's wallet balance.`,
            type: 'success',
          },
        });
        this.filterPayouts();
      },
      error: (err: any) => {
        this.isProcessingPayoutId = null;
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Error',
            body: err?.error?.message || 'Failed to reject payout request',
            type: 'error',
          },
        });
      }
    });
  }

  copyUpi(upi: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(upi);
    }
    alert(`UPI ID "${upi}" copied to clipboard!`);
  }

  addNewTicket() {
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      data: { type: 'add' },
      maxWidth: '75vw',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
