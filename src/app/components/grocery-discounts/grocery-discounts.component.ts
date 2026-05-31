import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LoaderComponent } from '../loader/loader.component';
import { EmptyDataComponent } from '../empty-data/empty-data.component';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-grocery-discounts',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, EmptyDataComponent],
  templateUrl: './grocery-discounts.component.html',
  styleUrl: './grocery-discounts.component.css'
})
export class GroceryDiscountsComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<GroceryDiscountsComponent>);
  private commonService = inject(CommonService);

  coupons: any[] = [];
  filteredCoupons: any[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';

  showForm: boolean = false;
  isEditMode: boolean = false;
  currentCoupon: any = {
    code: '',
    discount: '',
    min_order: '',
    expiry_date: '',
    is_active: true,
    condition: 'None'
  };

  ngOnInit(): void {
    this.getCoupons();
  }

  getCoupons() {
    this.isLoading = true;
    
    // Using a mock timeout to simulate your API call for now.
    // Replace this block with your actual CommonService integration
    setTimeout(() => {
      this.coupons = [
        { code: 'SAVE20', discount: '₹20', min_order: '₹100', expiry_date: '2025-12-31', is_active: true, condition: 'None' },
        { code: 'OFF50', discount: '₹50', min_order: '₹250', expiry_date: '2025-10-15', is_active: true, condition: 'New Users Only' },
        { code: 'WELCOME10', discount: '10%', min_order: '₹500', expiry_date: '2023-01-01', is_active: false, condition: 'First 3 Orders' }
      ];
      this.filteredCoupons = [...this.coupons];
      this.isLoading = false;
    }, 600);
  }

  searchCoupons() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredCoupons = this.coupons.filter(c =>
      c.code.toLowerCase().includes(term) ||
      c.discount.toString().toLowerCase().includes(term) ||
      (c.is_active ? 'active' : 'expired').includes(term)
    );
  }

  addNewCoupon() {
    this.isEditMode = false;
    this.currentCoupon = {
      code: '',
      discount: '',
      min_order: '',
      expiry_date: '',
      is_active: true,
      condition: 'None'
    };
    this.showForm = true;
  }

  editCoupon(coupon: any) {
    this.isEditMode = true;
    // Ensure expiry_date is formatted as YYYY-MM-DD for the date input
    let formattedDate = coupon.expiry_date;
    if (coupon.expiry_date instanceof Date) {
      formattedDate = coupon.expiry_date.toISOString().split('T')[0];
    }
    this.currentCoupon = { ...coupon, expiry_date: formattedDate };
    this.showForm = true;
  }

  saveCoupon() {
    console.log('Saving coupon:', this.currentCoupon);
    this.closeForm();
  }

  closeForm() {
    this.showForm = false;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
