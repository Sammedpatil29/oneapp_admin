import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoaderComponent } from '../loader/loader.component';
import { EmptyDataComponent } from '../empty-data/empty-data.component';
import { CommonService } from '../../services/common.service';
import { OrdersService } from '../../services/orders.service';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

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
  readonly dialog = inject(MatDialog);
  coupons: any[] = [];
  filteredCoupons: any[] = [];
  isLoading: boolean = false;
  searchTerm: string = '';

  showForm: boolean = true;
  isEditMode: boolean = false;
  currentCoupon: any = {
    code: '',
    discount: '',
    min_order: '',
    expiry_date: '',
    is_active: true,
    condition: 'None',
    max_discount: ''
  };

  constructor(private ordersService: OrdersService){}

  ngOnInit(): void {
    this.getCoupons();
  }

  getCoupons() {
    this.isLoading = true;
    this.ordersService.getGroceryCoupons().subscribe(
      (res: any) => {
        this.coupons = res.data;
        this.filteredCoupons = this.coupons;
        this.isLoading = false;
      },
      (error) => {
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Error',
            body: 'Failed to fetch coupons.',
            type: 'error'
          }
        });
        this.isLoading = false;
      }
    );
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
      condition: 'None',
      max_discount: ''
    };
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
    let params = {
      code: this.currentCoupon.code,
      discount: this.currentCoupon.discount,
      min_order: this.currentCoupon.min_order,
      expiry_date: this.currentCoupon.expiry_date,
      is_active: this.currentCoupon.is_active,
      condition: this.currentCoupon.condition,
      max_discount: this.currentCoupon.max_discount
    }
    if (this.isEditMode) {
      this.ordersService.updateGroceryCoupon(this.currentCoupon.id, params).subscribe(
        (res: any) => {
          this.getCoupons();
          this.closeForm();
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Success',
              body: 'Coupon updated successfully.'
            }
          });
        },
        (error) => {
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Error',
              body: 'Failed to update coupon.'
            }
          });
        }
      );
    } else {
      this.ordersService.createGroceryCoupon(params).subscribe(
        (res: any) => {
          this.getCoupons();
          this.closeForm();
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Success',
              body: 'Coupon created successfully.',
              type: 'success'
            }
          });
        },
        (error) => {
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Error',
              body: 'Failed to save coupon.',
              type: 'error'
          }
        });
      }
    );
  }
}

  closeForm() {
    this.showForm = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  deleteCoupon(coupon: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      data: {
        title: 'Confirm Deletion',
        body: 'Are you sure you want to delete this coupon?',
        type: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if (result === 'true' || result === true) {
        this.ordersService.deleteGroceryCoupon(coupon.id).subscribe(
          (res: any) => {
            this.getCoupons();
            this.dialog.open(AlertdialogComponent, {
              data: {
                title: 'Success',
                body: 'Coupon deleted successfully.',
                type: 'success'
              }
            }); 
          }
        );
      }
    });
  }
}

  
