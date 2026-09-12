import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoaderComponent } from "../loader/loader.component";
import {MatExpansionModule} from '@angular/material/expansion';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { ServiceControlComponent } from "../service-control/service-control.component";
import { SidebarSettingsComponent } from "../sidebar-settings/sidebar-settings.component";
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

@Component({
  selector: 'app-metadata',
  imports: [MatDialogModule, CommonModule, MatButtonModule, FormsModule, MatFormFieldModule, MatExpansionModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, LoaderComponent, ButtonSpinnerComponent, MatTabGroup, MatTab, ServiceControlComponent, SidebarSettingsComponent],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.css'
})
export class MetadataComponent implements OnInit{
metaData: any;
banners: any;
latest_version = ''
download_link = ''
last_updated = ''
otherDetails = ''
route = ''
imgUrl = ''
isCreateBanner:boolean = false
isMetaDataLoading:boolean = false
isBannersLoading:boolean = false
isMapDataLoading:boolean = false
strokeColor = '#a000e2'
areaColor = '#a000e2'
isMapUpdateLoading: boolean = false

// Multi-City Service Area State
serviceAreas: any[] = [];
selectedAreaId: string = '';
cityNameInput: string = '';
isActiveAreaInput: boolean = true;
isOfflineAreaInput: boolean = false;
offlineMessageInput: string = '';
areaDescriptionInput: string = '';
isCreatingNewArea: boolean = false;
polygonCoords: google.maps.LatLngLiteral[] = [];
currentPolygonOverlay: google.maps.Polygon | null = null;
otherPolygonOverlays: google.maps.Polygon[] = [];

  rideCommission = {
    type: 'fixed',
    value: 3,
    enabled: true,
    min_fare: 0
  };

@ViewChild('mapContainer', { static: false }) mapContainer: any;
  map!: google.maps.Map;
  drawingManager?: any;

  constructor(private commonService: CommonService, private dialog: MatDialog){}

  ngOnInit(): void {
      this.getMetaData()
      this.getbanners()
      this.getPolygonData()
  }

  ngAfterViewInit(): void {
    
  }

  getPolygonData() {
    this.isMapDataLoading = true;
    this.commonService.getServiceAreas().subscribe({
      next: (res: any) => {
        this.serviceAreas = res?.data || [];
        this.isMapDataLoading = false;
        if (this.serviceAreas.length > 0) {
          const selected = this.serviceAreas.find(a => a.id === this.selectedAreaId) || this.serviceAreas[0];
          this.selectServiceArea(selected);
        } else {
          this.startNewServiceArea();
        }
      },
      error: (err: any) => {
        this.isMapDataLoading = false;
        console.error('Error loading service areas:', err);
      }
    });
  }

  selectServiceArea(area: any) {
    this.isCreatingNewArea = false;
    this.selectedAreaId = area.id;
    this.cityNameInput = area.cityName || '';
    this.strokeColor = area.strokeColor || '#a000e2';
    this.areaColor = area.areaColor || '#a000e2';
    this.isActiveAreaInput = area.isActive !== undefined ? !!area.isActive : true;
    this.isOfflineAreaInput = area.isOffline !== undefined ? !!area.isOffline : false;
    this.offlineMessageInput = area.offlineMessage || '';
    this.areaDescriptionInput = area.description || '';
    this.polygonCoords = (area.polygon || []).map((p: any) => ({
      lat: Number(p.lat),
      lng: Number(p.lng)
    }));
    if (this.drawingManager) {
      this.drawingManager.setDrawingMode(null);
    }
    this.renderMapPolygons();
  }

  startNewServiceArea() {
    this.isCreatingNewArea = true;
    this.selectedAreaId = 'new';
    this.cityNameInput = '';
    this.strokeColor = '#a000e2';
    this.areaColor = '#a000e2';
    this.isActiveAreaInput = true;
    this.isOfflineAreaInput = false;
    this.offlineMessageInput = '';
    this.areaDescriptionInput = '';
    this.polygonCoords = [];
    this.renderMapPolygons();
    if (this.drawingManager && typeof google !== 'undefined' && google.maps?.drawing?.OverlayType) {
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
  }

  saveServiceArea() {
    if (!this.cityNameInput || !this.cityNameInput.trim()) {
      alert('Please enter a City Name (this serves as the primary area identity).');
      return;
    }
    if (!this.polygonCoords || this.polygonCoords.length < 3) {
      alert('Please draw a polygon with at least 3 points on the map to define the boundary.');
      return;
    }

    this.isMapUpdateLoading = true;
    const payload = {
      cityName: this.cityNameInput.trim(),
      polygon: this.polygonCoords,
      strokeColor: this.strokeColor,
      areaColor: this.areaColor,
      isActive: this.isActiveAreaInput,
      isOffline: this.isOfflineAreaInput,
      offlineMessage: this.offlineMessageInput ? this.offlineMessageInput.trim() : '',
      description: this.areaDescriptionInput
    };

    if (this.selectedAreaId === 'new') {
      this.commonService.createServiceArea(payload).subscribe({
        next: (res: any) => {
          this.isMapUpdateLoading = false;

          // Resolve the new ID from whichever shape the API returns
          const newId = res?.data?.id || res?.id || res?._id || String(Date.now());

          // Immediately reflect the new city in the UI without waiting for API refresh
          const newArea = {
            id: newId,
            cityName: payload.cityName,
            polygon: payload.polygon,
            strokeColor: payload.strokeColor,
            areaColor: payload.areaColor,
            isActive: payload.isActive,
            isOffline: payload.isOffline,
            offlineMessage: payload.offlineMessage,
            description: payload.description
          };
          this.serviceAreas = [...this.serviceAreas, newArea];
          this.isCreatingNewArea = false;
          this.selectedAreaId = newId;

          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Success',
              body: `Service area "${payload.cityName}" created successfully!`,
              type: 'success'
            }
          });

          // Then re-fetch from server to get authoritative data (correct IDs, timestamps etc.)
          this.getPolygonData();
        },
        error: (err: any) => {
          this.isMapUpdateLoading = false;
          alert('Failed to create service area: ' + (err?.error?.message || err.message));
        }
      });
    } else {
      this.commonService.updateServiceArea(this.selectedAreaId, payload).subscribe({
        next: () => {
          this.isMapUpdateLoading = false;
          this.dialog.open(AlertdialogComponent, {
            data: {
              title: 'Success',
              body: `Service area "${payload.cityName}" updated successfully!`,
              type: 'success'
            }
          });
          this.getPolygonData();
        },
        error: (err: any) => {
          this.isMapUpdateLoading = false;
          alert('Failed to update service area: ' + (err?.error?.message || err.message));
        }
      });
    }
  }

  deleteCurrentArea() {
    if (!this.selectedAreaId || this.selectedAreaId === 'new') return;
    if (!confirm(`Are you sure you want to delete the service area for "${this.cityNameInput}"?`)) return;

    this.isMapUpdateLoading = true;
    this.commonService.deleteServiceArea(this.selectedAreaId).subscribe({
      next: () => {
        this.isMapUpdateLoading = false;
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'Deleted',
            body: `Service area deleted successfully.`,
            type: 'success'
          }
        });
        this.selectedAreaId = '';
        this.getPolygonData();
      },
      error: (err: any) => {
        this.isMapUpdateLoading = false;
        alert('Failed to delete service area: ' + (err?.error?.message || err.message));
      }
    });
  }

  updatePolygonData() {
    this.saveServiceArea();
  }

  getMetaData(){
    this.isMetaDataLoading = true
      let params = {
        "fields": ["categories", "locations", "status", "ride_commission"]
      }
    this.commonService.getMetaDatabyQuerry(params).subscribe((res:any) => {
        this.metaData = res?.data || res
        this.latest_version = this.metaData?.latest_version
        this.download_link = this.metaData?.download_link
        this.last_updated = this.metaData?.last_updated
        this.otherDetails = this.metaData?.video

        if (this.metaData?.ride_commission) {
          this.rideCommission = {
            type: this.metaData.ride_commission.type || 'fixed',
            value: this.metaData.ride_commission.value !== undefined ? Number(this.metaData.ride_commission.value) : 3,
            enabled: this.metaData.ride_commission.enabled !== undefined ? !!this.metaData.ride_commission.enabled : true,
            min_fare: this.metaData.ride_commission.min_fare !== undefined ? Number(this.metaData.ride_commission.min_fare) : 0
          };
        }

        this.isMetaDataLoading = false
        try {
          if (this.otherDetails) {
            const parsed = JSON.parse(this.otherDetails);
            this.otherDetails = JSON.stringify(parsed, null, 10);
          }
        } catch (e) {}
        
    })
  }

  updateRideCommission() {
    const params = {
      ride_commission: {
        type: this.rideCommission.type,
        value: Number(this.rideCommission.value) || 0,
        enabled: this.rideCommission.enabled,
        min_fare: Number(this.rideCommission.min_fare) || 0
      }
    };
    this.commonService.updatePlygonData(params).subscribe({
      next: () => {
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'success',
            body: 'Ride platform commission settings updated successfully!',
            type: 'success',
          },
        });
      },
      error: (err: any) => {
        console.error('Commission update error:', err);
        this.dialog.open(AlertdialogComponent, {
          data: {
            title: 'error',
            body: 'Failed to update commission settings: ' + (err?.error?.message || err.message),
            type: 'error',
          },
        });
      }
    });
  }

  updateMetaData(){
    console.log('clicked')
    let params = {
      "id": this.metaData.id,
    "latest_version": this.latest_version,
    "last_updated": this.last_updated,
    "download_link": this.download_link,
    "video": JSON.stringify(JSON.parse(this.otherDetails))
    }
    this.commonService.updateMetaData(params, this.metaData.id).subscribe(res => {
      alert('details updated successfully')
    })
  }

  getbanners(){
    this.isBannersLoading = true
    this.commonService.getBanners().subscribe((res)=>{
        this.banners = res
        this.isBannersLoading = false
    })
  }

  createBanner(){
    let params = {
      "img": this.imgUrl,
      "route": this.route
    }
    this.isBannersLoading = true
    this.commonService.createBanner(params).subscribe((res)=>{
      this.getbanners()
      this.isBannersLoading = false
      alert('banner created')
    })
  }

  deleteBanner(id:any){
    console.log('deleting')
    this.commonService.deleteBanner(id).subscribe((res)=> {
      this.getbanners()
      alert("banner deleted successfully")
    })
  }

  updateBanner(id:any, img:any, route:any, active:any){
    let params = {
      "img": img,
      "route": route,
      "is_active": active
    }
    console.log(params)
    console.log('updating')
    this.commonService.updateBanner(id, params).subscribe((res)=> {
      this.getbanners()
      alert("banner updated successfully")
    })
  }

  onTabChange(event: any) {
    if (event.tab?.textLabel === 'Set Service Area' || event.index === 3) {
      setTimeout(() => {
        this.initMap();
        if (this.map && typeof google !== 'undefined') {
          google.maps.event.trigger(this.map, 'resize');
          if (this.polygonCoords.length >= 3) {
            const bounds = new google.maps.LatLngBounds();
            this.polygonCoords.forEach(c => bounds.extend(new google.maps.LatLng(c.lat, c.lng)));
            this.map.fitBounds(bounds);
          } else {
            this.map.setCenter({ lat: 16.7218, lng: 75.0503 });
            this.map.setZoom(13);
          }
        }
      }, 150);
    }
  }

  private ensureGoogleMapsLoaded(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof google !== 'undefined' && google.maps && google.maps.Map) {
        return resolve(true);
      }
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 100;
        if (typeof google !== 'undefined' && google.maps && google.maps.Map) {
          clearInterval(interval);
          resolve(true);
        } else if (elapsed >= 10000) {
          clearInterval(interval);
          console.warn('Google Maps JavaScript API load timed out.');
          resolve(false);
        }
      }, 100);
    });
  }

  async initMap(): Promise<void> {
    if (!this.mapContainer || !this.mapContainer.nativeElement) return;

    const isReady = await this.ensureGoogleMapsLoaded();
    if (!isReady) return;

    if (!this.map) {
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: { lat: 16.7218, lng: 75.0503 },
        zoom: 13,
      });

      // Fallback click listener to define polygon points directly on map if DrawingManager is deprecated
      this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (!this.drawingManager && event.latLng && (!this.polygonCoords || this.polygonCoords.length < 3)) {
          this.polygonCoords.push({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          });
          if (this.polygonCoords.length >= 3) {
            this.renderMapPolygons();
          }
        }
      });
    }

    if (!this.drawingManager) {
      try {
        if (typeof google !== 'undefined' && google.maps && google.maps.drawing && google.maps.drawing.DrawingManager) {
          this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: this.polygonCoords.length >= 3 ? null : google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [google.maps.drawing.OverlayType.POLYGON],
            },
            polygonOptions: {
              fillColor: this.areaColor || '#a000e2',
              fillOpacity: 0.35,
              strokeColor: this.strokeColor || '#a000e2',
              strokeWeight: 2.5,
              clickable: true,
              editable: true,
              zIndex: 10,
            },
          });

          this.drawingManager.setMap(this.map);

          google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event: any) => {
            if (event.type === google.maps.drawing.OverlayType.POLYGON) {
              if (this.currentPolygonOverlay) {
                this.currentPolygonOverlay.setMap(null);
              }
              this.currentPolygonOverlay = event.overlay as google.maps.Polygon;
              this.polygonCoords = this.currentPolygonOverlay.getPath().getArray().map(latlng => ({
                lat: latlng.lat(),
                lng: latlng.lng(),
              }));
              if (this.drawingManager) {
                this.drawingManager.setDrawingMode(null);
              }

              const path = this.currentPolygonOverlay.getPath();
              const updateCoords = () => {
                this.polygonCoords = path.getArray().map(p => ({
                  lat: p.lat(),
                  lng: p.lng(),
                }));
              };
              google.maps.event.addListener(path, 'set_at', updateCoords);
              google.maps.event.addListener(path, 'insert_at', updateCoords);
              google.maps.event.addListener(path, 'remove_at', updateCoords);

              this.currentPolygonOverlay.addListener('contextmenu', (e: any) => {
                if (e.vertex !== undefined) {
                  path.removeAt(e.vertex);
                }
              });
            }
          });
        }
      } catch (err) {
        console.warn('Google Maps DrawingManager initialization caught:', err);
        this.drawingManager = null;
      }
    }

    this.renderMapPolygons();
  }

  renderMapPolygons() {
    if (!this.map) {
      this.initMap();
      return;
    }

    if (this.currentPolygonOverlay) {
      this.currentPolygonOverlay.setMap(null);
      this.currentPolygonOverlay = null;
    }
    this.otherPolygonOverlays.forEach(p => p.setMap(null));
    this.otherPolygonOverlays = [];

    // 1. Render other configured city areas as background context (faint polygons)
    for (const area of this.serviceAreas) {
      if (area.id !== this.selectedAreaId && area.polygon && area.polygon.length >= 3) {
        const otherPoly = new google.maps.Polygon({
          paths: area.polygon,
          fillColor: area.areaColor || '#94a3b8',
          fillOpacity: 0.15,
          strokeColor: area.strokeColor || '#64748b',
          strokeWeight: 1.5,
          clickable: true,
          editable: false,
          zIndex: 1
        });
        otherPoly.setMap(this.map);
        otherPoly.addListener('click', () => {
          this.selectServiceArea(area);
        });
        this.otherPolygonOverlays.push(otherPoly);
      }
    }

    // 2. Render currently selected area as editable polygon
    if (this.polygonCoords.length >= 3) {
      this.currentPolygonOverlay = new google.maps.Polygon({
        paths: this.polygonCoords,
        fillColor: this.areaColor || '#a000e2',
        fillOpacity: 0.38,
        strokeColor: this.strokeColor || '#a000e2',
        strokeWeight: 2.5,
        clickable: true,
        editable: true,
        zIndex: 10
      });
      this.currentPolygonOverlay.setMap(this.map);

      const path = this.currentPolygonOverlay.getPath();
      const updateCoords = () => {
        this.polygonCoords = path.getArray().map(p => ({
          lat: p.lat(),
          lng: p.lng(),
        }));
      };
      google.maps.event.addListener(path, 'set_at', updateCoords);
      google.maps.event.addListener(path, 'insert_at', updateCoords);
      google.maps.event.addListener(path, 'remove_at', updateCoords);

      this.currentPolygonOverlay.addListener('contextmenu', (e: any) => {
        if (e.vertex !== undefined) {
          path.removeAt(e.vertex);
        }
      });

      // Fit map view to current area boundary
      const bounds = new google.maps.LatLngBounds();
      this.polygonCoords.forEach(c => bounds.extend(new google.maps.LatLng(c.lat, c.lng)));
      this.map.fitBounds(bounds);

      if (this.drawingManager) {
        this.drawingManager.setDrawingMode(null);
      }
    } else {
      if (this.drawingManager && typeof google !== 'undefined' && google.maps?.drawing?.OverlayType) {
        this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
      }
    }
  }

  // exportAsJson(): void {
  //   console.log(this.polygonCoords)
  //   const mapData = {
  //     serviceableArea: this.polygonCoords,
  //   };
  //   const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);

  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'map.json';
  //   a.click();
  //   URL.revokeObjectURL(url);
  // }

}
