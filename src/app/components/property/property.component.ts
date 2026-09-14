import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../loader/loader.component';
import { PropertyDialogComponent } from '../property-dialog/property-dialog.component';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { PropertyAdminService, PropertyItem } from '../../services/property-admin.service';

@Component({
  selector: 'app-property',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './property.component.html',
  styleUrl: './property.component.css'
})
export class PropertyComponent implements OnInit {
  private propertyService = inject(PropertyAdminService);
  readonly dialog = inject(MatDialog);

  properties: PropertyItem[] = [];
  filteredProperties: PropertyItem[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';
  selectedStatus: string = 'all';
  selectedCategory: string = 'all';

  // Counts for header tabs
  statusCounts = {
    all: 0,
    pending_verification: 0,
    verifying: 0,
    approved: 0,
    sold: 0,
    closed: 0,
    rejected: 0
  };

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.propertyService.getAllProperties({ status: 'all' }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res && res.success && Array.isArray(res.data)) {
          this.properties = res.data;
          this.computeStatusCounts();
          this.applyFilters();
        } else {
          this.properties = [];
          this.filteredProperties = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to fetch properties from API:', err);
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Error',
            body: 'Failed to load properties from server. Please check backend connection.',
            type: 'error'
          }
        });
      }
    });
  }

  computeStatusCounts(): void {
    this.statusCounts = {
      all: this.properties.length,
      pending_verification: this.properties.filter(p => p.status === 'pending_verification').length,
      verifying: this.properties.filter(p => p.status === 'verifying').length,
      approved: this.properties.filter(p => p.status === 'approved').length,
      sold: this.properties.filter(p => p.status === 'sold').length,
      closed: this.properties.filter(p => p.status === 'closed').length,
      rejected: this.properties.filter(p => p.status === 'rejected').length
    };
  }

  onStatusTabChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onCategoryChange(cat: string): void {
    this.selectedCategory = cat;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.properties];

    // Status filter
    if (this.selectedStatus !== 'all') {
      result = result.filter(p => p.status === this.selectedStatus);
    }

    // Category filter
    if (this.selectedCategory !== 'all') {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    // Search term
    if (this.searchTerm && this.searchTerm.trim()) {
      const q = this.searchTerm.trim().toLowerCase();
      result = result.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.locality && p.locality.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.propertyType && p.propertyType.toLowerCase().includes(q)) ||
        (p.fullAddress && p.fullAddress.toLowerCase().includes(q)) ||
        (p.seller && p.seller.name && p.seller.name.toLowerCase().includes(q)) ||
        (p.seller && p.seller.phone && p.seller.phone.includes(q))
      );
    }

    this.filteredProperties = result;
  }

  quickUpdateStatus(property: PropertyItem, newStatus: string, event: Event): void {
    event.stopPropagation();
    if (property.status === newStatus) return;

    this.propertyService.updateStatus(property.id, newStatus).subscribe({
      next: (res) => {
        if (res.success) {
          property.status = newStatus;
          this.computeStatusCounts();
          this.applyFilters();
        }
      },
      error: (err) => {
        console.error('Status update failed:', err);
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Error',
            body: 'Failed to update property status.',
            type: 'error'
          }
        });
      }
    });
  }

  toggleVerified(property: PropertyItem, event: Event): void {
    event.stopPropagation();
    const nextVal = !property.is_verified;

    this.propertyService.toggleVerified(property.id, nextVal).subscribe({
      next: (res) => {
        if (res.success) {
          property.is_verified = nextVal;
        }
      },
      error: (err) => {
        console.error('Verified toggle failed:', err);
      }
    });
  }

  openGoogleMaps(property: PropertyItem, event: Event): void {
    event.stopPropagation();
    const query = property.lat && property.lng
      ? `${property.lat},${property.lng}`
      : encodeURIComponent(`${property.title}, ${property.locality}, ${property.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  }

  openDialog(id: any, type: 'add' | 'edit', data: any = null): void {
    const dialogRef = this.dialog.open(PropertyDialogComponent, {
      data: {
        id: id,
        type: type,
        data: data ? { ...data } : null
      },
      width: '92vw',
      maxWidth: '1200px',
      maxHeight: '92vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProperties();
      }
    });
  }

  deleteProperty(property: PropertyItem, event: Event): void {
    event.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${property.title}"? This will deactivate the listing.`)) {
      return;
    }

    this.propertyService.deleteProperty(property.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.properties = this.properties.filter(p => p.id !== property.id);
          this.computeStatusCounts();
          this.applyFilters();
        }
      },
      error: (err) => {
        console.error('Delete property failed:', err);
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Error',
            body: 'Failed to delete property.',
            type: 'error'
          }
        });
      }
    });
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'buy_house': return 'Buy House';
      case 'rent_house': return 'Rent House';
      case 'buy_land': return 'Land';
      case 'buy_plot': return 'Plot';
      default: return category || 'Property';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved': return 'badge-status-approved';
      case 'pending_verification': return 'badge-status-pending';
      case 'verifying': return 'badge-status-verifying';
      case 'sold': return 'badge-status-sold';
      case 'closed': return 'badge-status-closed';
      case 'rejected': return 'badge-status-rejected';
      default: return 'badge-status-default';
    }
  }

  getStatusLabel(status: string, category?: string): string {
    switch (status) {
      case 'approved': return 'Approved (Live)';
      case 'pending_verification': return 'Pending Review';
      case 'verifying': return 'Verifying';
      case 'sold': return category === 'rent_house' ? 'Rented Out' : 'Sold Out';
      case 'closed': return 'Closed';
      case 'rejected': return 'Rejected';
      default: return status || 'Unknown';
    }
  }

  onImgError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'approved': return '✅';
      case 'pending_verification': return '⏳';
      case 'verifying': return '🔍';
      case 'sold': return '🔒';
      case 'closed': return '📁';
      case 'rejected': return '❌';
      default: return '⚪';
    }
  }
}
