import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../services/orders.service';
import { environment } from '../../../environments/environment';
import JSZip from 'jszip';

export interface ChecklistItemDef {
  key: string;
  label: string;
  category: 'Personal' | 'Vehicle' | 'Documents' | 'Verification';
  desc: string;
  icon: string;
  hasDocument: boolean;
}

export interface ExtractedDoc {
  url: string;
  fileName: string;
  isPdf: boolean;
  docNumber?: string;
}

export const DEFAULT_CHECKLIST: { [key: string]: 'pending' | 'verified' | 'not_verified' } = {
  personal_details: 'pending',
  vehicle_details: 'pending',
  driving_license: 'pending',
  vehicle_rc: 'pending',
  vehicle_insurance: 'pending',
  aadhaar_pan: 'pending',
  live_selfie: 'pending',
  background_verification: 'pending',
  safety_activation: 'pending'
};

@Component({
  selector: 'app-validation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.css'
})
export class ValidationComponent implements OnInit, OnDestroy {
  apiUrl = environment.apiUrl;

  readonly checklistDefinitions: ChecklistItemDef[] = [
    {
      key: 'personal_details',
      label: 'Personal Details',
      category: 'Personal',
      desc: 'Legal Name, Mobile Number, Email, City',
      icon: 'bi-person-badge',
      hasDocument: false
    },
    {
      key: 'vehicle_details',
      label: 'Vehicle Specifications',
      category: 'Vehicle',
      desc: 'Vehicle Model, Vehicle Number, Category & Fuel Type',
      icon: 'bi-car-front',
      hasDocument: false
    },
    {
      key: 'driving_license',
      label: 'Driving License (DL)',
      category: 'Documents',
      desc: 'Government issued transport / non-transport driving license',
      icon: 'bi-card-heading',
      hasDocument: true
    },
    {
      key: 'vehicle_rc',
      label: 'Vehicle RC Book',
      category: 'Documents',
      desc: 'Registration Certificate matching registered vehicle number',
      icon: 'bi-file-earmark-text',
      hasDocument: true
    },
    {
      key: 'vehicle_insurance',
      label: 'Vehicle Insurance',
      category: 'Documents',
      desc: 'Active policy document with valid future expiration',
      icon: 'bi-shield-check',
      hasDocument: true
    },
    {
      key: 'aadhaar_pan',
      label: 'Aadhaar / PAN Card',
      category: 'Documents',
      desc: 'Identity and PAN proof for background authentication',
      icon: 'bi-person-vcard',
      hasDocument: true
    },
    {
      key: 'live_selfie',
      label: 'Captain Live Selfie',
      category: 'Documents',
      desc: 'Live selfie photograph for face match and profile image',
      icon: 'bi-camera',
      hasDocument: true
    },
    {
      key: 'background_verification',
      label: 'Background Verification',
      category: 'Verification',
      desc: 'Criminal records & safety check verification',
      icon: 'bi-check2-circle',
      hasDocument: false
    },
    {
      key: 'safety_activation',
      label: 'Safety Onboarding & Activation',
      category: 'Verification',
      desc: 'Captain code of conduct agreement & driver console online access',
      icon: 'bi-shield-shaded',
      hasDocument: false
    }
  ];

  riders: any[] = [];
  filteredRiders: any[] = [];
  isLoading: boolean = false;
  isSaving: boolean = false;

  // Filters & Search
  searchQuery: string = '';
  statusFilter: 'all' | 'pending' | 'verified' | 'rejected' = 'all';

  // Selected Captain
  selectedCaptain: any = null;
  activeChecklist: { [key: string]: 'pending' | 'verified' | 'not_verified' } = { ...DEFAULT_CHECKLIST };
  verificationNotes: string = '';

  // Unzipping & Extracted Documents
  isUnzipping: boolean = false;
  unzipSuccess: boolean = false;
  unzipError: string = '';
  extractedDocImages: { [key: string]: ExtractedDoc } = {};
  extractedMeta: any = {};

  // Interactive Zoomable Image Modal State
  showImageModal: boolean = false;
  activeModalDoc: {
    key: string;
    title: string;
    url: string;
    fileName: string;
    isPdf: boolean;
    docNumber?: string;
  } | null = null;
  zoomLevel: number = 1;
  rotation: number = 0;

  // Alert banner
  alertMessage: string = '';
  alertType: 'success' | 'danger' | '' = '';

  presetNotes: string[] = [
    'All KYC documents verified & approved. Welcome to Pintu Captain!',
    'Driving License photo is blurry or illegible. Please re-upload a clear copy.',
    'Vehicle RC document does not match the registered vehicle number.',
    'Vehicle Insurance policy has expired. Please upload an active insurance copy.',
    'Live selfie is unclear or face is obstructed. Please re-take live photo.',
    'Aadhaar / PAN card number mismatch. Please review and re-submit.'
  ];

  constructor(
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadRiders();
    }
  }

  ngOnDestroy(): void {
    this.cleanUpBlobUrls();
  }

  cleanUpBlobUrls(): void {
    if (typeof window !== 'undefined' && window.URL) {
      for (const doc of Object.values(this.extractedDocImages)) {
        if (doc.url && doc.url.startsWith('blob:')) {
          URL.revokeObjectURL(doc.url);
        }
      }
    }
  }

  loadRiders(): void {
    this.isLoading = true;
    this.ordersService.getAllRiders().subscribe({
      next: (res: any) => {
        const rawList = Array.isArray(res) ? res : (res?.data || []);
        this.riders = rawList.map((r: any) => this.normalizeRider(r));
        this.applyFilters();
        this.isLoading = false;

        // Auto-select first captain or re-select active captain
        if (this.selectedCaptain) {
          const reFound = this.riders.find(r => r.id === this.selectedCaptain.id);
          if (reFound) {
            this.selectCaptain(reFound);
          } else if (this.filteredRiders.length > 0) {
            this.selectCaptain(this.filteredRiders[0]);
          }
        } else if (this.filteredRiders.length > 0) {
          this.selectCaptain(this.filteredRiders[0]);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching riders:', err);
        this.isLoading = false;
        this.showAlert('Failed to fetch Captain list: ' + (err.message || 'Server error'), 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  normalizeRider(rider: any): any {
    const kyc = rider.kyc_docs && typeof rider.kyc_docs === 'object' ? { ...rider.kyc_docs } : {};
    const rawChecklist = kyc.checklist || rider.verification_checklist || {};
    
    // Fill any missing keys with 'pending'
    const checklist: { [key: string]: 'pending' | 'verified' | 'not_verified' } = { ...DEFAULT_CHECKLIST };
    for (const key of Object.keys(DEFAULT_CHECKLIST)) {
      if (rawChecklist[key] && ['pending', 'verified', 'not_verified'].includes(rawChecklist[key])) {
        checklist[key] = rawChecklist[key];
      }
    }
    kyc.checklist = checklist;
    rider.kyc_docs = kyc;

    const anyNotVerified = Object.values(checklist).some(v => v === 'not_verified');
    const allVerified = Object.values(checklist).every(v => v === 'verified');
    const hasZip = !!(kyc.zip_archive && kyc.zip_archive.url);

    if (rider.is_verified || allVerified) {
      rider.computedStatus = 'verified';
    } else if (anyNotVerified) {
      rider.computedStatus = 'rejected';
    } else if (hasZip || (kyc && Object.keys(kyc).filter(k => k !== 'checklist').length > 0)) {
      rider.computedStatus = 'pending';
    } else {
      rider.computedStatus = 'pending_details';
    }

    return rider;
  }

  applyFilters(): void {
    const q = (this.searchQuery || '').trim().toLowerCase();
    this.filteredRiders = this.riders.filter((r) => {
      if (this.statusFilter === 'pending' && r.computedStatus !== 'pending' && r.computedStatus !== 'pending_details') {
        return false;
      }
      if (this.statusFilter === 'verified' && r.computedStatus !== 'verified') {
        return false;
      }
      if (this.statusFilter === 'rejected' && r.computedStatus !== 'rejected') {
        return false;
      }

      if (q) {
        const nameMatch = (r.name || '').toLowerCase().includes(q);
        const contactMatch = (r.contact || '').toLowerCase().includes(q);
        const emailMatch = (r.email || '').toLowerCase().includes(q);
        const vehicleMatch = (r.vehicle_number || '').toLowerCase().includes(q);
        const modelMatch = (r.vehicle_model || '').toLowerCase().includes(q);
        return nameMatch || contactMatch || emailMatch || vehicleMatch || modelMatch;
      }

      return true;
    });
  }

  setStatusFilter(filter: 'all' | 'pending' | 'verified' | 'rejected'): void {
    this.statusFilter = filter;
    this.applyFilters();
    if (this.filteredRiders.length > 0) {
      this.selectCaptain(this.filteredRiders[0]);
    } else {
      this.selectedCaptain = null;
    }
  }

  selectCaptain(captain: any): void {
    this.cleanUpBlobUrls();
    this.selectedCaptain = captain;
    const checklist = captain?.kyc_docs?.checklist || {};
    this.activeChecklist = {
      ...DEFAULT_CHECKLIST,
      ...checklist
    };
    this.verificationNotes = captain?.verification_message || '';
    this.extractedDocImages = {};
    this.extractedMeta = {};
    this.unzipSuccess = false;
    this.unzipError = '';

    // If server already has extracted files, populate them immediately
    if (captain?.kyc_docs?.extracted_files) {
      const files = captain.kyc_docs.extracted_files;
      for (const [docKey, relPath] of Object.entries(files)) {
        if (relPath && typeof relPath === 'string') {
          const fullUrl = this.resolveUrl(relPath);
          this.extractedDocImages[docKey] = {
            url: fullUrl,
            fileName: relPath.split('/').pop() || `${docKey}.jpg`,
            isPdf: relPath.toLowerCase().endsWith('.pdf')
          };
        }
      }
      this.unzipSuccess = Object.keys(this.extractedDocImages).length > 0;
    }

    // Auto-unzip client-side and trigger server extraction
    if (captain?.kyc_docs?.zip_archive?.url) {
      this.autoUnzipCaptainKyc(captain);
    }
  }

  async autoUnzipCaptainKyc(captain: any): Promise<void> {
    this.isUnzipping = true;
    const zipUrl = this.getZipUrl(captain);

    // Also notify server to extract to disk in background
    if (captain.id) {
      this.ordersService.unzipRiderKyc(captain.id).subscribe({
        next: (res: any) => {
          if (res?.extracted_files) {
            for (const [key, relPath] of Object.entries(res.extracted_files)) {
              if (relPath && typeof relPath === 'string' && !this.extractedDocImages[key]) {
                this.extractedDocImages[key] = {
                  url: this.resolveUrl(relPath),
                  fileName: relPath.split('/').pop() || `${key}.jpg`,
                  isPdf: relPath.toLowerCase().endsWith('.pdf')
                };
              }
            }
            if (res.meta_details) {
              this.extractedMeta = { ...this.extractedMeta, ...res.meta_details };
            }
            this.cdr.detectChanges();
          }
        },
        error: () => {} // Non-blocking background call
      });
    }

    if (!zipUrl) {
      this.isUnzipping = false;
      return;
    }

    try {
      const response = await fetch(zipUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} fetching ZIP archive`);
      }
      const blob = await response.blob();
      const zip = new JSZip();
      const loadedZip = await zip.loadAsync(blob);

      const entries = Object.keys(loadedZip.files);
      for (const filePath of entries) {
        const file = loadedZip.files[filePath];
        if (file.dir) continue;

        const lowerName = file.name.toLowerCase();
        const baseName = lowerName.split('/').pop() || lowerName;

        if (baseName === 'metadata.json') {
          try {
            const metaText = await file.async('text');
            const metaObj = JSON.parse(metaText);
            this.extractedMeta = { ...this.extractedMeta, ...metaObj };
            if (metaObj.documents) {
              this.extractedMeta = { ...this.extractedMeta, ...metaObj.documents };
            }
          } catch (e) {}
        } else {
          const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(baseName);
          const isPdf = /\.pdf$/i.test(baseName);

          if (isImage || isPdf) {
            const fileBlob = await file.async('blob');
            const objectUrl = URL.createObjectURL(fileBlob);

            let matchedKey = '';
            if (baseName.startsWith('dl') || baseName.includes('license')) {
              matchedKey = 'driving_license';
            } else if (baseName.startsWith('rc') || baseName.includes('registration')) {
              matchedKey = 'vehicle_rc';
            } else if (baseName.startsWith('insurance') || baseName.includes('policy')) {
              matchedKey = 'vehicle_insurance';
            } else if (baseName.startsWith('adhaar') || baseName.startsWith('aadhaar') || baseName.includes('pan')) {
              matchedKey = 'aadhaar_pan';
            } else if (baseName.startsWith('selfie') || baseName.includes('photo') || baseName.includes('face')) {
              matchedKey = 'live_selfie';
            }

            if (matchedKey) {
              this.extractedDocImages[matchedKey] = {
                url: objectUrl,
                fileName: file.name.split('/').pop() || file.name,
                isPdf
              };
            }
          }
        }
      }

      this.isUnzipping = false;
      this.unzipSuccess = Object.keys(this.extractedDocImages).length > 0;
      this.cdr.detectChanges();
    } catch (err: any) {
      console.warn('Client-side ZIP extraction note:', err.message);
      this.isUnzipping = false;
      // If server already provided extracted files, consider it a success
      this.unzipSuccess = Object.keys(this.extractedDocImages).length > 0;
      this.cdr.detectChanges();
    }
  }

  hasDocImage(key: string): boolean {
    return !!(this.extractedDocImages[key] && this.extractedDocImages[key].url);
  }

  getDocImageUrl(key: string): string {
    return this.extractedDocImages[key]?.url || '';
  }

  getDocFileName(key: string): string {
    return this.extractedDocImages[key]?.fileName || `${key}.jpg`;
  }

  isDocPdf(key: string): boolean {
    return !!this.extractedDocImages[key]?.isPdf;
  }

  // Open Zoomable Image Modal
  openImageModal(key: string): void {
    const docDef = this.checklistDefinitions.find(d => d.key === key);
    const docImage = this.extractedDocImages[key];

    if (!docImage && !this.selectedCaptain?.kyc_docs?.zip_archive) {
      this.showAlert(`No document file uploaded for ${docDef?.label || key}`, 'danger');
      return;
    }

    this.activeModalDoc = {
      key,
      title: docDef?.label || 'Document Review',
      url: docImage?.url || this.getZipUrl(this.selectedCaptain),
      fileName: docImage?.fileName || `${key}_document`,
      isPdf: docImage?.isPdf || false,
      docNumber: this.getDocNumber(key)
    };
    this.zoomLevel = 1;
    this.rotation = 0;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.activeModalDoc = null;
    this.zoomLevel = 1;
    this.rotation = 0;
  }

  zoomIn(): void {
    if (this.zoomLevel < 3.5) {
      this.zoomLevel = +(this.zoomLevel + 0.25).toFixed(2);
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel = +(this.zoomLevel - 0.25).toFixed(2);
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.rotation = 0;
  }

  rotateDoc(): void {
    this.rotation = (this.rotation + 90) % 360;
  }

  setModalItemStatus(status: 'pending' | 'verified' | 'not_verified'): void {
    if (!this.activeModalDoc) return;
    this.setItemStatus(this.activeModalDoc.key, status);
  }

  setItemStatus(key: string, status: 'pending' | 'verified' | 'not_verified'): void {
    this.activeChecklist[key] = status;
  }

  approveAll(): void {
    for (const key of Object.keys(this.activeChecklist)) {
      this.activeChecklist[key] = 'verified';
    }
    if (!this.verificationNotes) {
      this.verificationNotes = 'All KYC documents verified & approved. Welcome to Pintu Captain!';
    }
  }

  resetAllToPending(): void {
    for (const key of Object.keys(this.activeChecklist)) {
      this.activeChecklist[key] = 'pending';
    }
  }

  applyPresetNote(note: string): void {
    this.verificationNotes = note;
  }

  saveVerification(): void {
    if (!this.selectedCaptain) return;

    this.isSaving = true;
    const allVerified = Object.values(this.activeChecklist).every(v => v === 'verified');

    let is_verified = false;
    if (allVerified) {
      is_verified = true;
    }

    const payload = {
      checklist: this.activeChecklist,
      is_verified,
      verification_message: this.verificationNotes
    };

    this.ordersService.updateRiderChecklist(this.selectedCaptain.id, payload).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        this.showAlert(
          allVerified
            ? `Captain ${this.selectedCaptain.name || 'Account'} has been Approved and Activated! 🚀`
            : `Checklist updated for ${this.selectedCaptain.name || 'Captain'}.`,
          'success'
        );

        // Update in-memory state
        if (this.selectedCaptain.kyc_docs) {
          this.selectedCaptain.kyc_docs.checklist = { ...this.activeChecklist };
        }
        this.selectedCaptain.is_verified = is_verified;
        this.selectedCaptain.verification_message = this.verificationNotes;
        this.normalizeRider(this.selectedCaptain);
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error saving checklist:', err);
        this.showAlert('Failed to save checklist: ' + (err.message || 'Server error'), 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  getDocDetail(captain: any, key: string): string {
    return this.getDocNumber(key);
  }

  getDocNumber(key: string): string {
    const kyc = this.selectedCaptain?.kyc_docs || {};
    const meta = this.extractedMeta || {};

    if (key === 'driving_license') {
      return (
        kyc.driving_license?.number ||
        kyc.driving_license?.doc_number ||
        meta['driving_license']?.number ||
        (typeof kyc.driving_license === 'string' ? kyc.driving_license : '')
      );
    }
    if (key === 'vehicle_rc') {
      return (
        kyc.vehicle_rc?.number ||
        kyc.vehicle_rc?.doc_number ||
        meta['vehicle_rc']?.number ||
        this.selectedCaptain?.vehicle_number ||
        (typeof kyc.vehicle_rc === 'string' ? kyc.vehicle_rc : '')
      );
    }
    if (key === 'vehicle_insurance') {
      return (
        kyc.vehicle_insurance?.valid_until ||
        kyc.vehicle_insurance?.validUntil ||
        meta['vehicle_insurance']?.valid_until ||
        kyc.vehicle_insurance?.number ||
        ''
      );
    }
    if (key === 'aadhaar_pan') {
      return (
        kyc.aadhaar_pan?.number ||
        kyc.aadhaar_pan?.doc_number ||
        meta['aadhaar_pan']?.number ||
        (typeof kyc.aadhaar_pan === 'string' ? kyc.aadhaar_pan : '')
      );
    }
    return '';
  }

  getZipUrl(captain: any): string {
    const relativeOrAbsolute = captain?.kyc_docs?.zip_archive?.url;
    if (!relativeOrAbsolute) return '';
    return this.resolveUrl(relativeOrAbsolute);
  }

  resolveUrl(relUrl: string): string {
    if (!relUrl) return '';
    if (relUrl.startsWith('http://') || relUrl.startsWith('https://') || relUrl.startsWith('blob:')) {
      return relUrl;
    }
    const cleanUrl = relUrl.startsWith('/') ? relUrl : `/${relUrl}`;
    return `${this.apiUrl}${cleanUrl}`;
  }

  getZipFileName(captain: any): string {
    return captain?.kyc_docs?.zip_archive?.filename || 'kyc_documents.zip';
  }

  getZipFileSizeKb(captain: any): string {
    const size = captain?.kyc_docs?.zip_archive?.size;
    if (!size) return '';
    if (size > 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    }
    return (size / 1024).toFixed(1) + ' KB';
  }

  get totalCount(): number {
    return this.riders.length;
  }

  get pendingCount(): number {
    return this.riders.filter(r => r.computedStatus === 'pending' || r.computedStatus === 'pending_details').length;
  }

  get verifiedCount(): number {
    return this.riders.filter(r => r.computedStatus === 'verified').length;
  }

  get rejectedCount(): number {
    return this.riders.filter(r => r.computedStatus === 'rejected').length;
  }

  showAlert(message: string, type: 'success' | 'danger'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      if (this.alertMessage === message) {
        this.alertMessage = '';
        this.alertType = '';
        this.cdr.detectChanges();
      }
    }, 5000);
  }
}

