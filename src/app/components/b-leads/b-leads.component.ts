import { Component } from '@angular/core';
import { BrahmadecServiceService } from '../../services/brahmadec-service.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BLeadDetailsComponent } from '../b-lead-details/b-lead-details.component';

@Component({
  selector: 'app-b-leads',
  imports: [CommonModule, FormsModule],
  templateUrl: './b-leads.component.html',
  styleUrl: './b-leads.component.css'
})
export class BLeadsComponent {
leads: any[] = [];
  filteredLeads: any[] = [];
  response: any[] = [];
  searchTerm: string = 'new';
  isLoading: boolean = false;

  constructor(
    private service: BrahmadecServiceService, 
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.getLeads();
  }

  getLeads() {
    this.isLoading = true;
    this.service.getLeads().subscribe({
      next: (res: any) => {
        this.leads = res;
        this.getResponseList();
        this.handleSearch();
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

 viewLead(lead: any) {
  const dialogRef = this.dialog.open(BLeadDetailsComponent, {
    data: lead.id,
    width: 'auto', // Increased width for more horizontal breathing room
    maxWidth: '95vw', // Ensures it doesn't overflow on smaller screens
    panelClass: 'custom-dialog-container' // Critical for global CSS overrides
  });

  dialogRef.afterClosed().subscribe(result => {
     this.getLeads()
    });
}

  handleSearch() {
    const query = this.searchTerm.toLowerCase().trim();
    if (!query) {
      this.filteredLeads = [...this.leads];
      return;
    }

    if (query === 'scheduled') {
      this.filteredLeads = this.leads.filter(l => l.visit_schedule);
      return;
    }

    this.filteredLeads = this.leads.filter(l => 
      l.name.toLowerCase().includes(query) || 
      l.city?.toLowerCase().includes(query) ||
      l.response.toLowerCase().includes(query)
    );
  }

  getResponseList() {
    const statuses = [...new Set(this.leads.map(l => l.response))];
    this.response = statuses.sort((a, b) => a === 'new' ? -1 : 1);
  }

  resetSearch() { this.searchTerm = ''; this.handleSearch(); }
  scheduledSearch() { this.searchTerm = 'scheduled'; this.handleSearch(); }
  filterbyChips(val: string) { this.searchTerm = val; this.handleSearch(); }
  back() { window.history.back(); }
  addLead() { this.router.navigate(['/add-lead']); }
}
