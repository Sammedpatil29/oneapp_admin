import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { PropertyAdminService, PropertyItem } from '../../services/property-admin.service';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

export interface NearbyLandmarkItem {
  name: string;
  distance: string;
  type: 'school' | 'hospital' | 'transit' | 'market' | 'bank' | string;
}

export interface LegalCheckItem {
  title: string;
  category: string;
  status: 'clear' | 'pending' | 'not_applicable' | string;
  statusLabel: string;
  details: string;
}

@Component({
  selector: 'app-property-dialog',
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
  templateUrl: './property-dialog.component.html',
  styleUrl: './property-dialog.component.css'
})
export class PropertyDialogComponent implements OnInit {
  private propertyService = inject(PropertyAdminService);
  private dialogRef = inject(MatDialogRef<PropertyDialogComponent>);
  private dialog = inject(MatDialog);

  isEditMode: boolean = false;
  isSaving: boolean = false;
  headerTitle: string = 'Add New Property';

  // Section 1: Lifecycle & Category
  id: string = '';
  category: string = 'buy_house';
  propertyType: string = 'Independent Villa';
  title: string = '';
  status: string = 'approved';
  is_verified: boolean = true;

  // Category-specific property types (matching OneApp)
  readonly propertyTypesByCat: Record<string, string[]> = {
    buy_house: [
      'Independent Villa',
      'Independent House',
      'Duplex Bungalow',
      'Residential Apartment',
      'Row House',
      'Commercial Building'
    ],
    rent_house: [
      'Independent House',
      'Residential Apartment',
      'Studio Room',
      'Duplex Villa',
      'Commercial Shop / Office'
    ],
    buy_land: [
      'Agricultural Land',
      'Commercial Land',
      'Farmhouse Land',
      'Industrial Land'
    ],
    buy_plot: [
      'Residential Gated Plot',
      'Corner Plot',
      'Commercial Plot',
      'DC Converted NA Plot'
    ]
  };

  // Section 2: Pricing & Financials
  price: number | null = null;
  priceDisplay: string = '';
  priceUnit: string = '';
  securityDeposit: number | null = null;
  maintenancePerMonth: number | null = null;
  pricePerSqFt: string = '';
  emiEstimate: string = '';

  // Section 3: Location & Coordinates
  locality: string = '';
  city: string = 'Jamkhandi';
  fullAddress: string = '';
  lat: number | null = 16.5062;
  lng: number | null = 75.2985;

  // Section 4: Specifications
  bedrooms: number | null = 3;
  bathrooms: number | null = 2;
  balconies: number | null = 1;
  carpetAreaSqFt: number | null = 1200;
  superBuiltUpAreaSqFt: number | null = 1450;
  totalAcres: number | null = null;
  facing: string = 'East';
  furnishing: string = 'Semi-Furnished';
  possessionStatus: string = 'Ready to Move';
  ageOfProperty: string = '1-2 Years';
  floor: string = 'Ground + 1st Floor';
  parking: string = 'Covered Car Parking';
  waterSupply: string = '24/7 Municipal & Borewell';

  // Section 5: Seller Details
  sellerName: string = '';
  sellerType: string = 'Owner';
  sellerPhone: string = '';
  sellerWhatsapp: string = '';
  sellerResponseRate: string = 'Under 15 mins';

  // Section 6: Photos Gallery
  images: string[] = [];
  newImageUrl: string = '';

  // Section 7: Description, Amenities & Tags
  description: string = '';
  selectedAmenities: string[] = [];
  customAmenityInput: string = '';
  tagsInput: string = 'Verified, Zero Brokerage, Ready to Move, Vastu Compliant';

  // Category-specific default amenities (matching OneApp)
  readonly defaultAmenitiesByCat: Record<string, string[]> = {
    buy_house: [
      'Car Parking',
      '24/7 Water Supply',
      'Power Backup',
      'CCTV Security',
      'Private Garden',
      '100% Vastu Compliant',
      'High Compound Wall',
      'Gated Community',
      'Rainwater Harvesting',
      'Solar Water Heater'
    ],
    rent_house: [
      'Car Parking',
      '24/7 Water Supply',
      'Power Backup',
      'Geyser / Hot Water',
      'Wardrobes Built-in',
      'Balcony',
      'CCTV Security',
      'Lift / Elevator',
      'Bike Parking',
      'Modular Kitchen'
    ],
    buy_land: [
      'Tar Road Access',
      'Borewell Available',
      'Open Well Water',
      'River / Canal Water Proximity',
      'Water Pipeline Connectivity',
      '3-Phase Power Supply',
      'Fenced Boundary / Wire Fencing',
      'Clear Farm Track Approach',
      'Fertile Soil (Black/Red)',
      'Drip Irrigation Setup'
    ],
    buy_plot: [
      'Tar / Concrete Wide Roads',
      'Underground Drainage (UGD)',
      'Electricity / Power Supply',
      'Street Lights Installed',
      'Municipal Water Connection',
      'Gated Community with Arch',
      'CCTV & 24/7 Security Guard',
      'Parks & Green Tree Plantation',
      'Compound Wall Demarcation',
      'Children Play Park'
    ]
  };

  // Section 8: Nearby Landmarks & Connectivity (matching OneApp & DB)
  nearbyLandmarks: NearbyLandmarkItem[] = [];
  newLandmarkName: string = '';
  newLandmarkDistance: string = '';
  newLandmarkType: string = 'transit';

  // Section 9: Legal Verification Checklist (matching OneApp & DB)
  legalChecks: LegalCheckItem[] = [];
  newDocTitle: string = '';
  newDocCategory: string = 'Legal Clearance';
  newDocDetails: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id?: string; type: 'add' | 'edit'; data?: PropertyItem }) {}

  ngOnInit(): void {
    if (this.data && this.data.type === 'edit' && this.data.data) {
      this.isEditMode = true;
      this.headerTitle = `Edit Property: ${this.data.data.title || this.data.data.id}`;
      this.populateForm(this.data.data);
    } else {
      this.isEditMode = false;
      this.headerTitle = 'Add New Property Listing';
      this.initNewListingDefaults();
    }
  }

  get currentPropertyTypes(): string[] {
    return this.propertyTypesByCat[this.category] || this.propertyTypesByCat['buy_house'];
  }

  get currentAvailableAmenities(): string[] {
    return this.defaultAmenitiesByCat[this.category] || this.defaultAmenitiesByCat['buy_house'];
  }

  onCategoryChange(): void {
    const types = this.currentPropertyTypes;
    if (!types.includes(this.propertyType)) {
      this.propertyType = types[0] || 'Independent House';
    }

    if (this.category === 'rent_house') {
      this.priceUnit = '/month';
    } else {
      this.priceUnit = '';
    }

    // Auto-calculate suggested price display if price exists
    if (this.price) {
      this.updateCalculatedPriceFields();
    }

    // If new listing, refresh default legal checks for the category
    if (!this.isEditMode && this.legalChecks.length === 0) {
      this.initDefaultLegalChecks();
    }
  }

  private initNewListingDefaults(): void {
    this.images = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ];
    this.selectedAmenities = [...this.currentAvailableAmenities.slice(0, 5)];
    this.nearbyLandmarks = [
      { name: 'City Bus Stand / Auto Stand', distance: '1.0 km', type: 'transit' },
      { name: 'General Hospital', distance: '1.2 km', type: 'hospital' },
      { name: 'English Medium High School', distance: '800 m', type: 'school' }
    ];
    this.initDefaultLegalChecks();
  }

  private initDefaultLegalChecks(): void {
    if (this.category === 'rent_house') {
      this.legalChecks = [
        { title: 'Registered Rental Agreement', category: 'Rental Agreement', status: 'clear', statusLabel: 'Draft Ready', details: 'Standard 11-month bilingual rental agreement ready for execution.' },
        { title: 'Owner NOC & ID Proof', category: 'Ownership Verification', status: 'clear', statusLabel: 'Verified', details: 'Verified owner identity card, electricity bill, and tenancy permission.' },
        { title: 'Police Tenant Verification Form', category: 'Safety & Verification', status: 'clear', statusLabel: 'Available', details: 'Assistance with local police verification form and record keeping.' }
      ];
    } else if (this.category === 'buy_land' || this.category === 'buy_plot') {
      this.legalChecks = [
        { title: 'Title Deed & Ownership Proof', category: 'Ownership Verification', status: 'clear', statusLabel: 'Clear Title', details: 'Registered Sale Deed with unbroken chain of title records.' },
        { title: '7/12 RTC & Mutation Records', category: 'Revenue Records', status: 'clear', statusLabel: 'Clear RTC', details: 'Updated RTC record with cultivator and ownership rights.' },
        { title: 'Encumbrance Certificate (EC)', category: 'Legal Clearance', status: 'clear', statusLabel: 'Clear (15 Years)', details: 'Nil Encumbrance Certificate verified free of bank/legal dues.' },
        { title: 'DC Conversion (NA Order)', category: 'Government Approvals', status: 'clear', statusLabel: 'Approved', details: 'Revenue conversion status and agricultural demarcation verified.' },
        { title: 'Property Tax Receipts', category: 'Tax Compliance', status: 'clear', statusLabel: 'Paid (Current FY)', details: 'Municipal or Gram Panchayat property tax paid up to date.' },
        { title: 'Bank Loan Eligibility', category: 'Finance Clearance', status: 'clear', statusLabel: 'Pre-Approved', details: 'Pre-approved for fast loans with leading nationalized banks.' }
      ];
    } else {
      this.legalChecks = [
        { title: 'Title Deed & Ownership Proof', category: 'Ownership Verification', status: 'clear', statusLabel: 'Clear Title', details: 'Registered Sale Deed with unbroken chain of title records.' },
        { title: 'Khata Certificate', category: 'Revenue Records', status: 'clear', statusLabel: 'A-Khata Verified', details: 'Town Municipal Council (TMC) / Revenue record assessed.' },
        { title: 'Encumbrance Certificate (EC)', category: 'Legal Clearance', status: 'clear', statusLabel: 'Clear (15 Years)', details: 'Nil Encumbrance Certificate verified free of bank/legal dues.' },
        { title: 'Sanctioned Plan / DC Order', category: 'Government Approvals', status: 'clear', statusLabel: 'Approved', details: 'Approved layout sanction by Town Planning authority.' },
        { title: 'Property Tax Receipts', category: 'Tax Compliance', status: 'clear', statusLabel: 'Paid (Current FY)', details: 'Municipal or Gram Panchayat property tax paid up to date.' },
        { title: 'Occupancy Certificate (OC)', category: 'Possession & Compliance', status: 'clear', statusLabel: 'OC Issued', details: 'TMC issued Occupancy Certificate verified.' },
        { title: 'Bank Loan Eligibility', category: 'Finance Clearance', status: 'clear', statusLabel: 'Pre-Approved', details: 'Pre-approved for fast loans with leading nationalized banks.' }
      ];
    }
  }

  private populateForm(item: PropertyItem): void {
    this.id = item.id;
    this.category = item.category || 'buy_house';
    this.propertyType = item.propertyType || 'Independent Villa';
    this.title = item.title || '';
    this.status = item.status || 'approved';
    this.is_verified = item.is_verified ?? true;

    this.price = item.price !== undefined && item.price !== null ? Number(item.price) : null;
    this.priceDisplay = item.priceDisplay || '';
    this.priceUnit = item.priceUnit || (this.category === 'rent_house' ? '/month' : '');
    this.securityDeposit = item.securityDeposit !== undefined && item.securityDeposit !== null ? Number(item.securityDeposit) : null;
    this.maintenancePerMonth = item.maintenancePerMonth !== undefined && item.maintenancePerMonth !== null ? Number(item.maintenancePerMonth) : null;
    this.pricePerSqFt = item.pricePerSqFt || '';
    this.emiEstimate = item.emiEstimate || '';

    this.locality = item.locality || '';
    this.city = item.city || 'Jamkhandi';
    this.fullAddress = item.fullAddress || '';
    this.lat = item.lat || (item.coordinates ? item.coordinates.lat : null);
    this.lng = item.lng || (item.coordinates ? item.coordinates.lng : null);

    this.bedrooms = item.bedrooms !== undefined && item.bedrooms !== null ? Number(item.bedrooms) : null;
    this.bathrooms = item.bathrooms !== undefined && item.bathrooms !== null ? Number(item.bathrooms) : null;
    this.balconies = item.balconies !== undefined && item.balconies !== null ? Number(item.balconies) : null;
    this.carpetAreaSqFt = item.carpetAreaSqFt !== undefined && item.carpetAreaSqFt !== null ? Number(item.carpetAreaSqFt) : null;
    this.superBuiltUpAreaSqFt = item.superBuiltUpAreaSqFt !== undefined && item.superBuiltUpAreaSqFt !== null ? Number(item.superBuiltUpAreaSqFt) : null;
    this.totalAcres = item.totalAcres !== undefined && item.totalAcres !== null ? Number(item.totalAcres) : null;
    this.facing = item.facing || 'East';
    this.furnishing = item.furnishing || 'Semi-Furnished';
    this.possessionStatus = item.possessionStatus || 'Ready to Move';
    this.ageOfProperty = item.ageOfProperty || '1-2 Years';
    this.floor = item.floor || 'Ground + 1st Floor';
    this.parking = item.parking || 'Covered Car Parking';
    this.waterSupply = item.waterSupply || '24/7 Municipal & Borewell';

    if (item.seller) {
      this.sellerName = item.seller.name || '';
      this.sellerType = item.seller.type || 'Owner';
      this.sellerPhone = item.seller.phone || '';
      this.sellerWhatsapp = item.seller.whatsapp || '';
      this.sellerResponseRate = item.seller.responseRate || 'Under 15 mins';
    }

    this.images = Array.isArray(item.images) ? [...item.images] : [];
    this.description = item.description || '';
    this.selectedAmenities = Array.isArray(item.amenities) ? [...item.amenities] : [];
    this.tagsInput = Array.isArray(item.tags) ? item.tags.join(', ') : '';

    this.nearbyLandmarks = Array.isArray(item.nearbyLandmarks)
      ? item.nearbyLandmarks.map(l => ({ name: l.name, distance: l.distance, type: l.type }))
      : [];

    this.legalChecks = Array.isArray(item.legalChecks)
      ? item.legalChecks.map(c => ({
          title: c.title,
          category: c.category,
          status: c.status || 'clear',
          statusLabel: c.statusLabel || (c.status === 'clear' ? 'Verified' : 'Pending'),
          details: c.details || ''
        }))
      : [];

    if (this.legalChecks.length === 0) {
      this.initDefaultLegalChecks();
    }
  }

  // Price Calculation Helpers
  onPriceBlur(): void {
    this.updateCalculatedPriceFields();
  }

  updateCalculatedPriceFields(): void {
    if (!this.price || this.price <= 0) return;

    if (!this.priceDisplay) {
      if (this.category === 'rent_house') {
        this.priceDisplay = `₹${this.price.toLocaleString('en-IN')}`;
      } else if (this.price >= 10000000) {
        this.priceDisplay = `₹${(this.price / 10000000).toFixed(2)} Cr`;
      } else if (this.price >= 100000) {
        this.priceDisplay = `₹${(this.price / 100000).toFixed(1)} L`;
      } else {
        this.priceDisplay = `₹${this.price.toLocaleString('en-IN')}`;
      }
    }

    if (!this.pricePerSqFt) {
      const area = this.superBuiltUpAreaSqFt || this.carpetAreaSqFt;
      if (area && area > 0) {
        this.pricePerSqFt = `₹${Math.round(this.price / area).toLocaleString('en-IN')} / sq.ft`;
      }
    }

    if (!this.emiEstimate && this.category !== 'rent_house') {
      this.emiEstimate = `₹${Math.round(this.price * 0.0075).toLocaleString('en-IN')}/mo`;
    }
  }

  // Amenities Helpers
  toggleAmenity(amenity: string): void {
    const idx = this.selectedAmenities.indexOf(amenity);
    if (idx >= 0) {
      this.selectedAmenities.splice(idx, 1);
    } else {
      this.selectedAmenities.push(amenity);
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities.includes(amenity);
  }

  addCustomAmenity(): void {
    const val = this.customAmenityInput.trim();
    if (val && !this.selectedAmenities.includes(val)) {
      this.selectedAmenities.push(val);
      this.customAmenityInput = '';
    }
  }

  removeAmenity(index: number): void {
    this.selectedAmenities.splice(index, 1);
  }

  // Nearby Landmarks Helpers
  addLandmark(): void {
    if (!this.newLandmarkName.trim() || !this.newLandmarkDistance.trim()) return;
    this.nearbyLandmarks.push({
      name: this.newLandmarkName.trim(),
      distance: this.newLandmarkDistance.trim(),
      type: this.newLandmarkType
    });
    this.newLandmarkName = '';
    this.newLandmarkDistance = '';
  }

  removeLandmark(index: number): void {
    this.nearbyLandmarks.splice(index, 1);
  }

  // Legal Document Checks Helpers
  toggleLegalCheckStatus(check: LegalCheckItem): void {
    if (check.status === 'clear') {
      check.status = 'pending';
      check.statusLabel = 'Pending';
    } else {
      check.status = 'clear';
      check.statusLabel = 'Verified';
    }
  }

  addCustomLegalDoc(): void {
    if (!this.newDocTitle.trim()) return;
    this.legalChecks.push({
      title: this.newDocTitle.trim(),
      category: this.newDocCategory.trim() || 'Custom Verification',
      status: 'clear',
      statusLabel: 'Verified',
      details: this.newDocDetails.trim() || `Verified documentation by ${this.sellerName || 'Admin'}.`
    });
    this.newDocTitle = '';
    this.newDocDetails = '';
  }

  removeLegalCheck(index: number): void {
    this.legalChecks.splice(index, 1);
  }

  // Media Helpers
  addImage(): void {
    if (this.newImageUrl && this.newImageUrl.trim()) {
      this.images.push(this.newImageUrl.trim());
      this.newImageUrl = '';
    }
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
  }

  // Save / Update Property
  saveProperty(): void {
    if (!this.title || !this.title.trim()) {
      alert('Property title is required.');
      return;
    }
    if (!this.price || this.price <= 0) {
      alert('Valid property price is required.');
      return;
    }
    if (!this.locality || !this.locality.trim()) {
      alert('Locality is required.');
      return;
    }
    if (!this.fullAddress || !this.fullAddress.trim()) {
      alert('Full Address is required.');
      return;
    }

    const tags = this.tagsInput
      ? this.tagsInput.split(',').map(s => s.trim()).filter(Boolean)
      : ['Verified'];

    const coordinates = (this.lat && this.lng) ? { lat: Number(this.lat), lng: Number(this.lng) } : null;

    const payload: any = {
      category: this.category,
      propertyType: this.propertyType,
      title: this.title.trim(),
      price: Number(this.price),
      priceDisplay: this.priceDisplay.trim() || undefined,
      priceUnit: this.category === 'rent_house' ? (this.priceUnit || '/month') : '',
      securityDeposit: this.category === 'rent_house' && this.securityDeposit !== null ? Number(this.securityDeposit) : null,
      maintenancePerMonth: this.maintenancePerMonth !== null ? Number(this.maintenancePerMonth) : null,
      pricePerSqFt: this.pricePerSqFt.trim() || undefined,
      emiEstimate: this.category !== 'rent_house' && this.emiEstimate.trim() ? this.emiEstimate.trim() : undefined,
      locality: this.locality.trim(),
      city: this.city.trim() || 'Jamkhandi',
      fullAddress: this.fullAddress.trim(),
      lat: this.lat !== null ? Number(this.lat) : null,
      lng: this.lng !== null ? Number(this.lng) : null,
      coordinates: coordinates,
      images: this.images.length > 0 ? this.images : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      bedrooms: (this.category === 'buy_house' || this.category === 'rent_house') && this.bedrooms !== null ? Number(this.bedrooms) : null,
      bathrooms: (this.category === 'buy_house' || this.category === 'rent_house') && this.bathrooms !== null ? Number(this.bathrooms) : null,
      balconies: (this.category === 'buy_house' || this.category === 'rent_house') && this.balconies !== null ? Number(this.balconies) : null,
      carpetAreaSqFt: this.carpetAreaSqFt !== null ? Number(this.carpetAreaSqFt) : 0,
      superBuiltUpAreaSqFt: this.superBuiltUpAreaSqFt !== null ? Number(this.superBuiltUpAreaSqFt) : (this.carpetAreaSqFt ? Number(this.carpetAreaSqFt) : 0),
      totalAcres: (this.category === 'buy_land' || this.category === 'buy_plot') && this.totalAcres !== null ? Number(this.totalAcres) : null,
      facing: this.facing,
      furnishing: this.furnishing,
      possessionStatus: this.possessionStatus,
      ageOfProperty: this.ageOfProperty,
      floor: (this.category === 'buy_land' || this.category === 'buy_plot') ? '' : this.floor,
      parking: (this.category === 'buy_land' || this.category === 'buy_plot') ? '' : this.parking,
      waterSupply: this.waterSupply,
      seller: {
        name: this.sellerName.trim() || 'Property Owner',
        type: this.sellerType || 'Owner',
        phone: this.sellerPhone.trim(),
        whatsapp: (this.sellerWhatsapp || this.sellerPhone).replace(/[^0-9]/g, ''),
        verified: this.is_verified,
        responseRate: this.sellerResponseRate
      },
      description: this.description.trim() || `${this.title} located in ${this.locality}, ${this.city}.`,
      amenities: [...this.selectedAmenities],
      nearbyLandmarks: [...this.nearbyLandmarks],
      legalChecks: [...this.legalChecks],
      tags: tags,
      status: this.status,
      is_verified: this.is_verified
    };

    this.isSaving = true;

    if (this.isEditMode && this.id) {
      this.propertyService.updateProperty(this.id, payload).subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success) {
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Failed to update property:', err);
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Error',
              body: 'Failed to update property. Please check backend connection.',
              type: 'error'
            }
          });
        }
      });
    } else {
      this.propertyService.createProperty(payload).subscribe({
        next: (res) => {
          this.isSaving = false;
          if (res.success) {
            this.dialogRef.close(true);
          }
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Failed to create property:', err);
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Error',
              body: 'Failed to create property. Please check backend connection.',
              type: 'error'
            }
          });
        }
      });
    }
  }

  deletePropertyItem(): void {
    if (!this.id) return;
    if (!confirm(`Are you sure you want to delete "${this.title}"? This will deactivate the listing.`)) {
      return;
    }

    this.isSaving = true;
    this.propertyService.deleteProperty(this.id).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Failed to delete property:', err);
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
}
