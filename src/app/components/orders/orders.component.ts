import { Component } from '@angular/core';
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { GoogleMapsModule } from '@angular/google-maps';
import {MatChipsModule} from '@angular/material/chips';

@Component({
  selector: 'app-orders',
  imports: [EmptyDataComponent, GoogleMapsModule, MatChipsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {
 readonly chipsOptions: string[] = ['Map View', 'List View'];
orders = []

center: google.maps.LatLngLiteral = { lat: 16.731534, lng: 75.050348 };
  zoom = 14.5;

  polygonPaths: google.maps.LatLngLiteral[] = [
    { lat: 16.721820, lng: 75.041123 }, 
    { lat: 16.731534, lng: 75.044394 },
    { lat: 16.733517, lng: 75.050348},
    { lat: 16.736431, lng: 75.062371},
    { lat: 16.727415, lng: 75.075158},
    { lat: 16.716180, lng: 75.073141},
    { lat: 16.704540, lng: 75.067789},
    { lat: 16.709470, lng: 75.055160},
    { lat: 16.714950, lng: 75.044911},
  ];

  generatedPoints: google.maps.LatLngLiteral[] = [
    { lat: 16.719841, lng: 75.050290 },
    { lat: 16.723528, lng: 75.057112 },
    { lat: 16.715672, lng: 75.061847 },
    { lat: 16.724905, lng: 75.069351 },
    { lat: 16.712384, lng: 75.058297 },
    { lat: 16.725312, lng: 75.046832 },
    { lat: 16.730182, lng: 75.059740 },
    { lat: 16.710473, lng: 75.067132 },
    { lat: 16.717918, lng: 75.053958 },
    { lat: 16.726631, lng: 75.063280 },
    { lat: 16.714950, lng: 75.044911 }
  ];

  selectedMarker: any = ''

  onMarkerClick(marker: google.maps.LatLngLiteral) {
    this.selectedMarker = marker;
    console.log('Marker clicked:', marker);
  }
}
