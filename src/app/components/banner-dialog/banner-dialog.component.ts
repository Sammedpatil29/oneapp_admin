import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonService } from '../../services/common.service';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

export interface BannerDialogData {
  type: 'create' | 'edit';
  item?: any;
  servicesList?: any[];
  serviceAreas?: any[];
  placementTags?: string[];
}

@Component({
  selector: 'app-banner-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './banner-dialog.component.html',
  styleUrl: './banner-dialog.component.css'
})
export class BannerDialogComponent implements OnInit {
  private commonService = inject(CommonService);
  private dialogRef = inject(MatDialogRef<BannerDialogComponent>);
  private dialog = inject(MatDialog);

  isEditMode: boolean = false;
  isSaving: boolean = false;
  isDeleting: boolean = false;
  headerTitle: string = 'Create New Banner';

  // Services and Cities data passed from parent
  servicesList: any[] = [];
  serviceAreas: any[] = [];
  placementTags: string[] = ['hometop', 'homedown', 'grocery'];

  // Custom placement tag inline input
  customPlacementInput: string = '';
  isAddingCustomTag: boolean = false;

  bannerForm = {
    id: null as any,
    title: '',
    img: '',
    route: '',
    service_id: null as any,
    cities: [] as string[],
    placements: ['hometop'] as string[],
    priority: 0,
    is_active: true
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: BannerDialogData) {}

  ngOnInit(): void {
    if (this.data) {
      if (Array.isArray(this.data.servicesList)) {
        this.servicesList = [...this.data.servicesList];
      }
      if (Array.isArray(this.data.serviceAreas)) {
        this.serviceAreas = [...this.data.serviceAreas];
      }
      if (Array.isArray(this.data.placementTags) && this.data.placementTags.length > 0) {
        this.placementTags = Array.from(new Set([...this.placementTags, ...this.data.placementTags]));
      }

      if (this.data.type === 'edit' && this.data.item) {
        this.isEditMode = true;
        const item = this.data.item;
        this.headerTitle = item.title ? `Edit Banner: ${item.title}` : `Edit Banner #${item.id}`;

        let rawPlacements = item.placements;
        if (!rawPlacements || !Array.isArray(rawPlacements) || rawPlacements.length === 0) {
          rawPlacements = item.placement ? [item.placement] : ['hometop'];
        }

        // Add any missing tags from this banner to placementTags
        rawPlacements.forEach((t: string) => {
          if (t && !this.placementTags.includes(t)) {
            this.placementTags.push(t);
          }
        });

        this.bannerForm = {
          id: item.id,
          title: item.title || '',
          img: item.img || '',
          route: item.route || '',
          service_id: item.service_id || null,
          cities: Array.isArray(item.cities) ? [...item.cities] : [],
          placements: [...rawPlacements],
          priority: item.priority !== undefined ? item.priority : 0,
          is_active: item.is_active !== undefined ? !!item.is_active : true
        };
      } else {
        this.isEditMode = false;
        this.headerTitle = 'Create New Banner';
        this.bannerForm = {
          id: null,
          title: '',
          img: '',
          route: '',
          service_id: null,
          cities: [],
          placements: ['hometop'],
          priority: 0,
          is_active: true
        };
      }
    }
  }

  addCustomPlacementTag(): void {
    const tag = (this.customPlacementInput || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (!tag) return;
    if (!this.placementTags.includes(tag)) {
      this.placementTags.push(tag);
    }
    if (!this.bannerForm.placements.includes(tag)) {
      this.bannerForm.placements.push(tag);
    }
    this.customPlacementInput = '';
    this.isAddingCustomTag = false;
  }

  getAvailableCities(): string[] {
    const set = new Set<string>();
    (this.serviceAreas || []).forEach((a: any) => {
      if (a.cityName) set.add(a.cityName);
    });
    return Array.from(set);
  }

  getServiceTitle(serviceId: any): string {
    if (!serviceId) return 'None (Global)';
    const svc = this.servicesList.find(s => String(s.id) === String(serviceId));
    return svc ? svc.title : `Service #${serviceId}`;
  }

  isServiceActive(serviceId: any): boolean {
    if (!serviceId) return true;
    const svc = this.servicesList.find(s => String(s.id) === String(serviceId));
    return svc ? svc.status === 'active' : false;
  }

  saveBanner(): void {
    if (!this.bannerForm.img || !this.bannerForm.img.trim()) {
      this.dialog.open(AlertdialogComponent, {
        data: {
          title: 'Missing Image',
          body: 'Please enter a valid banner image URL.',
          type: 'error'
        }
      });
      return;
    }

    const placements = (this.bannerForm.placements && this.bannerForm.placements.length > 0)
      ? this.bannerForm.placements
      : ['hometop'];

    const matchedService = this.servicesList.find(s => String(s.id) === String(this.bannerForm.service_id));
    const payload = {
      title: this.bannerForm.title ? this.bannerForm.title.trim() : '',
      img: this.bannerForm.img.trim(),
      route: this.bannerForm.route ? this.bannerForm.route.trim() : '',
      service_id: this.bannerForm.service_id || null,
      service_title: matchedService ? matchedService.title : '',
      cities: this.bannerForm.cities || [],
      placements: placements,
      placement: placements[0] || 'hometop',
      priority: Number(this.bannerForm.priority || 0),
      is_active: this.bannerForm.is_active
    };

    this.isSaving = true;

    if (this.isEditMode && this.bannerForm.id) {
      this.commonService.updateBanner(this.bannerForm.id, payload).subscribe({
        next: (res: any) => {
          this.isSaving = false;
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Success',
              body: 'Banner updated successfully!',
              type: 'success'
            }
          });
          this.dialogRef.close({ saved: true, data: res });
        },
        error: (err: any) => {
          this.isSaving = false;
          console.error('Failed to update banner:', err);
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Error',
              body: 'Failed to update banner: ' + (err?.error?.message || err.message),
              type: 'error'
            }
          });
        }
      });
    } else {
      this.commonService.createBanner(payload).subscribe({
        next: (res: any) => {
          this.isSaving = false;
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Success',
              body: 'Banner created successfully!',
              type: 'success'
            }
          });
          this.dialogRef.close({ saved: true, data: res });
        },
        error: (err: any) => {
          this.isSaving = false;
          console.error('Failed to create banner:', err);
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Error',
              body: 'Failed to create banner: ' + (err?.error?.message || err.message),
              type: 'error'
            }
          });
        }
      });
    }
  }

  deleteBanner(): void {
    if (!this.bannerForm.id) return;
    if (!confirm('Are you sure you want to permanently delete this banner?')) return;

    this.isDeleting = true;
    this.commonService.deleteBanner(this.bannerForm.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Deleted',
            body: 'Banner deleted successfully!',
            type: 'success'
          }
        });
        this.dialogRef.close({ saved: true, deleted: true });
      },
      error: (err: any) => {
        this.isDeleting = false;
        console.error('Failed to delete banner:', err);
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Error',
            body: 'Failed to delete banner: ' + (err?.error?.message || err.message),
            type: 'error'
          }
        });
      }
    });
  }
}

