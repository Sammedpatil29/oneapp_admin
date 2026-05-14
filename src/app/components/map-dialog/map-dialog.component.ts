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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    console.log(this.data)
    const riderLocation = { lat: this.data.rider.lat, lng: this.data.rider.lng };
    const customerLocation = { lat: this.data.customer.lat, lng: this.data.customer.lng };

    // Default location pin SVG
    let iconPath = 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'; 
    
    const bikePath = `
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <circle style="fill:#FFF59B;" cx="256" cy="256" r="256"/>
  <path style="fill:#FFD782;" d="M3.87,300.138C24.796,420.477,129.676,512,256,512s231.204-91.523,252.13-211.862H3.87z"/>
  <g>
    <path style="fill:#FFB469;" d="M220.69,344.276H79.448c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828H220.69c4.875,0,8.828,3.953,8.828,8.828l0,0C229.517,340.323,225.565,344.276,220.69,344.276z"/>
    <path style="fill:#FFB469;" d="M432.552,344.276H291.31c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828h141.241c4.875,0,8.828,3.953,8.828,8.828l0,0C441.379,340.323,437.427,344.276,432.552,344.276z"/>
  </g>
  <path style="fill:#6EC8E6;" d="M480.103,379.586c3.179-5.757,6.155-11.638,8.894-17.655H23.004c2.738,6.017,5.714,11.898,8.893,17.655H480.103z"/>
  <path style="fill:#FF5550;" d="M70.761,432.552c5.888,6.181,12.06,12.087,18.535,17.655h333.407c6.476-5.568,12.647-11.474,18.535-17.655H70.761z"/>
  <g>
    <path style="fill:#46415F;" d="M349.432,494.345c12.628-4.958,24.792-10.84,36.349-17.655H126.219c11.556,6.815,23.721,12.697,36.349,17.655H349.432z"/>
    <path style="fill:#46415F;" d="M419.794,292.793l-49.035-32.69v-65.897c0-4.876-3.953-8.828-8.828-8.828s-8.828,3.951-8.828,8.828v65.897l-49.035,32.69c-4.057,2.705-5.153,8.185-2.449,12.242c1.7,2.552,4.5,3.933,7.353,3.933c1.682,0,3.383-0.481,4.888-1.484l48.069-32.046l48.07,32.046c1.505,1.004,3.206,1.484,4.888,1.484c2.854,0,5.653-1.38,7.353-3.933C424.946,300.978,423.85,295.497,419.794,292.793z"/>
  </g>
  <path style="fill:#413241;" d="M150.069,344.276c-43.808,0-79.448-35.64-79.448-79.448s35.64-79.448,79.448-79.448s79.448,35.64,79.448,79.448S193.877,344.276,150.069,344.276z M150.069,203.034c-34.073,0-61.793,27.721-61.793,61.793s27.72,61.793,61.793,61.793s61.793-27.721,61.793-61.793S184.142,203.034,150.069,203.034z"/>
  <circle style="fill:#46415F;" cx="150.069" cy="264.828" r="61.793"/>
  <path style="fill:#413241;" d="M361.931,344.276c-43.808,0-79.448-35.64-79.448-79.448s35.64-79.448,79.448-79.448s79.448,35.64,79.448,79.448S405.739,344.276,361.931,344.276z M361.931,203.034c-34.073,0-61.793,27.721-61.793,61.793s27.72,61.793,61.793,61.793s61.793-27.721,61.793-61.793S396.004,203.034,361.931,203.034z"/>
  <path style="fill:#46415F;" d="M361.931,176.552c-4.875,0-8.828-3.953-8.828-8.828s3.953-8.828,8.828-8.828c2.435,0,4.414-1.978,4.414-4.414s-1.978-4.414-4.414-4.414h-17.655v17.655c0,4.875-3.953,8.828-8.828,8.828s-8.828-3.953-8.828-8.828v-26.483c0-4.875,3.953-8.828,8.828-8.828h26.483c12.168,0,22.069,9.901,22.069,22.069S374.099,176.552,361.931,176.552z"/>
  <path style="fill:#6EC8E6;" d="M370.447,262.505l-26.483-97.103c-0.01-0.035-0.026-0.066-0.038-0.102c-0.243-0.852-0.615-1.671-1.116-2.429c-0.038-0.057-0.074-0.115-0.113-0.171c-0.237-0.342-0.499-0.67-0.789-0.981c-0.053-0.056-0.109-0.109-0.163-0.164c-0.119-0.121-0.233-0.246-0.36-0.362c-0.158-0.143-0.324-0.273-0.49-0.403c-0.044-0.035-0.085-0.073-0.13-0.107c-0.341-0.258-0.698-0.483-1.064-0.685c-0.064-0.035-0.129-0.068-0.194-0.103c-0.386-0.201-0.78-0.377-1.185-0.518c-0.017-0.006-0.033-0.009-0.05-0.014c-0.408-0.138-0.824-0.239-1.244-0.316c-0.06-0.011-0.118-0.025-0.178-0.034c-0.426-0.068-0.854-0.102-1.283-0.107c-0.042-0.001-0.081-0.01-0.121-0.01H196.808l-12.591-22.035c-2.418-4.232-7.808-5.705-12.044-3.285c-4.234,2.419-5.704,7.811-3.286,12.044l25.752,45.067l-51.631,68.843c-2.005,2.675-2.328,6.254-0.833,9.244c1.495,2.99,4.552,4.879,7.895,4.879c0,0,96.785,0,97.105,0c2.472,0,4.847-1.038,6.531-2.89l77.459-85.204l22.252,81.589c1.07,3.926,4.628,6.507,8.511,6.507c0.769,0,1.55-0.102,2.327-0.313C368.957,272.062,371.731,267.209,370.447,262.505z M229.517,256h-61.793l36.458-48.611l28.017,49.028C231.353,256.148,230.453,256,229.517,256z M248.81,249.902l-41.913-73.351h108.596L248.81,249.902z"/>
  <path style="fill:#567795;" d="M119.474,255.996c-1.5,0-3.021-0.384-4.418-1.19c-4.215-2.444-5.655-7.844-3.211-12.065c3.88-6.694,9.465-12.276,16.151-16.142c4.22-2.453,9.625-0.995,12.061,3.224c2.44,4.22,0.995,9.621-3.224,12.061c-4.018,2.323-7.375,5.681-9.711,9.711C125.483,254.418,122.521,255.996,119.474,255.996z"/>
  <path style="fill:#4E5C7A;" d="M150.069,308.966c-15.699,0-30.34-8.448-38.216-22.047c-2.444-4.22-1.004-9.617,3.215-12.061c4.224-2.449,9.625-1,12.061,3.215c4.728,8.163,13.517,13.237,22.94,13.237c4.655,0,9.233-1.224,13.237-3.539c4.207-2.44,9.617-1,12.061,3.224c2.44,4.22,1,9.617-3.224,12.061C165.461,306.922,157.827,308.966,150.069,308.966z"/>
  <path style="fill:#46415F;" d="M203.034,150.069h-31.656c-4.715,0-9.146-1.836-12.483-5.173l-6.241-6.241c-3.448-3.448-3.448-9.035,0-12.483s9.035-3.448,12.483,0l6.241,6.241h31.656c4.875,0,8.828,3.953,8.828,8.828C211.862,146.115,207.91,150.069,203.034,150.069z"/>
  <path style="fill:#413241;" d="M273.655,291.31h-10.763l-1.103-4.414c7.145-4.748,11.866-12.866,11.866-22.069c0-14.603-11.881-26.483-26.483-26.483c-14.602,0-26.483,11.88-26.483,26.483c0,13.757,10.545,25.092,23.974,26.36l1.1,4.403c1.967,7.874,9.011,13.375,17.128,13.375h10.764c4.875,0,8.828-3.953,8.828-8.828S278.53,291.31,273.655,291.31z M238.345,264.828c0-4.867,3.96-8.828,8.828-8.828c4.867,0,8.828,3.96,8.828,8.828s-3.96,8.828-8.828,8.828C242.305,273.655,238.345,269.695,238.345,264.828z"/>
  <path style="fill:#FFF59B;" d="M397.241,414.897h-70.621c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828h70.621c4.875,0,8.828,3.953,8.828,8.828l0,0C406.069,410.944,402.116,414.897,397.241,414.897z"/>
  <g>
    <path style="fill:#FFC373;" d="M211.862,414.897h-61.793c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828h61.793c4.875,0,8.828,3.953,8.828,8.828l0,0C220.69,410.944,216.737,414.897,211.862,414.897z"/>
    <path style="fill:#FFC373;" d="M114.759,414.897h-8.828c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828h8.828c4.875,0,8.828,3.953,8.828,8.828l0,0C123.586,410.944,119.634,414.897,114.759,414.897z"/>
  </g>
  <path style="fill:#FFF59B;" d="M291.31,414.897h-8.828c-4.875,0-8.828-3.953-8.828-8.828l0,0c0-4.875,3.953-8.828,8.828-8.828h8.828c4.875,0,8.828,3.953,8.828,8.828l0,0C300.138,410.944,296.185,414.897,291.31,414.897z"/>
</svg>`;

    const homePath = `
<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <g>
    <path fill="#0C6667" d="M32,29c0,1.65-1.35,3-3,3H3c-1.65,0-3-1.35-3-3V3c0-1.65,1.35-3,3-3h26c1.65,0,3,1.35,3,3V29z"/>
    <path fill="#01A59C" d="M29,0H16v6c0,0,6.166,0,6.246,0c0.769,0,1.538,0.292,2.121,0.875L31.493,14H29v18c1.65,0,3-1.35,3-3V3C32,1.35,30.65,0,29,0z"/>
    <path fill="#F8AD89" d="M3,14v18h12V14H3z M12,24H6v-6h6V24z"/>
    <path fill="#F4D6B0" d="M15,14v18h3V21c0-1.65,1.35-3,3-3h2c1.65,0,3,1.35,3,3v11h3V14H15z"/>
    <rect x="6" y="18" fill="#01A59C" width="6" height="6"/>
    <path fill="#F27261" d="M22,6.023V6H10v0.023C9.315,6.079,8.646,6.354,8.125,6.875L1,14h9h3l7.125-7.125C20.646,6.354,21.315,6.079,22,6.023z"/>
    <path fill="#E54D2E" d="M26,21v11h-8V21c0-1.65,1.35-3,3-3h2C24.65,18,26,19.35,26,21z M24.368,6.875C23.784,6.292,23.015,6,22.246,6s-1.538,0.292-2.121,0.875L13,14h18.493L24.368,6.875z"/>
  </g>
</svg>`;

    // if (this.data.type === 'rider') {
    //   iconPath = bikePath;
    // } else if (this.data.type === 'customer') {
    //   iconPath = homePath;
    // }
    let centerLocation;
    if(this.data.type === 'rider'){
      centerLocation = riderLocation;
    } else {
      centerLocation = customerLocation;
     }

    if (this.mapContainer && typeof google !== 'undefined' && google.maps) {
      const map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: centerLocation,
        zoom: 15,
      });

      new google.maps.Marker({
        position: customerLocation,
        map: map,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(homePath),
          scaledSize: new google.maps.Size(40, 40), // Adjust this value to make the icon larger or smaller
          anchor: new google.maps.Point(20, 20),
        }
      });

     if(this.data.rider.lat && this.data.rider.lng){
       new google.maps.Marker({
        position: riderLocation,
        map: map,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(bikePath),
          scaledSize: new google.maps.Size(40, 40), // Adjust this value to make the icon larger or smaller
          anchor: new google.maps.Point(20, 20),
        }
      });

      // Draw a curved line (parabola) between the rider and customer
      new google.maps.Polyline({
        path: this.getCurvedPath(riderLocation, customerLocation),
        map: map,
        geodesic: false, 
        strokeColor: '#0c0c0c', // Blue color
        strokeOpacity: 0.8,
        strokeWeight: 1.5
      });
     }
    } else {
      console.error('Google Maps API not loaded. Make sure to include the script tag in index.html');
    }
  }

  getCurvedPath(start: { lat: number; lng: number }, end: { lat: number; lng: number }): { lat: number; lng: number }[] {
    const curvePoints = [];
    const numPoints = 100;

    // Midpoint
    const latCenter = (start.lat + end.lat) / 2;
    const lngCenter = (start.lng + end.lng) / 2;

    // Offset for the curve (perpendicular vector)
    const latDiff = end.lat - start.lat;
    const lngDiff = end.lng - start.lng;

    // Control point (0.2 determines the curvature magnitude)
    const curvature = 0.2;
    const latControl = latCenter - lngDiff * curvature;
    const lngControl = lngCenter + latDiff * curvature;

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const u = 1 - t;

      const lat = (u * u * start.lat) + (2 * u * t * latControl) + (t * t * end.lat);
      const lng = (u * u * start.lng) + (2 * u * t * lngControl) + (t * t * end.lng);

      curvePoints.push({ lat, lng });
    }

    return curvePoints;
  }
}
