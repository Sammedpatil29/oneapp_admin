import { Component, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-map-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.css']
})
export class MapDialogComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { lat: number, lng: number, type?: string }
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    const location = { lat: this.data.lat, lng: this.data.lng };
    
    // Default location pin SVG
    let iconPath = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'; 
    
    const bikePath = 'M19.44 9.03L15.41 5H11v2h3.59l2.45 2.45L12.55 14H7.92L4.5 10.59l-1.41 1.41L6.5 15.41V15.41H13l3.55-3.55C17.27 11.38 18.23 10.6 19.44 9.03z M19 12c-2.76 0-5 2.24-5 5s2.24 5 5 5c2.76 0 5-2.24 5-5S21.76 12 19 12z M19 20c-1.66 0-3-1.34-3-3c0-1.66 1.34-3 3-3c1.66 0 3 1.34 3 3C22 18.66 20.66 20 19 20z M5 12c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5S7.76 12 5 12z M5 20c-1.66 0-3-1.34-3-3c0-1.66 1.34-3 3-3s3 1.34 3 3C8 18.66 6.66 20 5 20z M11 18v-2h2v2H11z';
    const homePath = 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z';

    if (this.data.type === 'rider') {
      iconPath = bikePath;
    } else if (this.data.type === 'customer') {
      iconPath = homePath;
    }

    if (this.mapContainer && typeof google !== 'undefined' && google.maps) {
      const map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: location,
        zoom: 15,
      });

      new google.maps.Marker({
        position: location,
        map: map,
        icon: {
          path: iconPath,
          fillColor: '#ea4335',
          fillOpacity: 1,
          strokeWeight: 0,
          scale: 1.5, // Adjust this value to make the icon larger or smaller
          anchor: new google.maps.Point(12, 12),
        }
      });

      new google.maps.Marker({
        position: location,
        map: map,
        icon: {
          path: iconPath,
          fillColor: '#35ea80',
          fillOpacity: 1,
          strokeWeight: 1,
          scale: 1, // Adjust this value to make the icon larger or smaller
          anchor: new google.maps.Point(12, 12),
        }
      });
    } else {
      console.error('Google Maps API not loaded. Make sure to include the script tag in index.html');
    }
  }
}
