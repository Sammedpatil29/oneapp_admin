import { Component, OnInit } from '@angular/core';
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { GoogleMapsModule } from '@angular/google-maps';
import {MatChipsModule} from '@angular/material/chips';
import { CommonService } from '../../services/common.service';
import { LoaderComponent } from "../loader/loader.component";
import {MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  imports: [EmptyDataComponent, GoogleMapsModule, MatChipsModule, LoaderComponent, MatTabsModule, CommonModule, FormsModule],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.css'
})
export class VisitsComponent implements OnInit{
 readonly chipsOptions: string[] = ['Map View', 'List View'];
orders: any;
allVisits: any;
isLoading: boolean = false
ordersSelected: boolean = true
showSideBox: boolean = true
deliveryOrder: boolean = true
orderType: string = 'Delivery'
visitsName: any = ''

 markerIcon: any = {
  new: {
    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  },
  confirmed: {
    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  },
  packed: {
    url: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
  },
  outForDelivery: {
    url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
  },
  delivered: {
    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
  },
  selected: {
    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  }
};


center: google.maps.LatLngLiteral = { lat: 16.715672, lng: 75.061847 };
  zoom = 10;

  polygonPaths: google.maps.LatLngLiteral[] = []

  generatedPoints: any[] = [];


  selectedMarker: any = ''

  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getAllVisits()
      // this.commonService.getPolygonData().subscribe((res:any) => {
      //   console.log(res)
      //   this.polygonPaths = res.polygon
      // })
      this.polygonPaths = [
    {
        "lat": 16.855825766127545,
        "lng": 75.21813590502931
    },
    {
        "lat": 16.945176395891032,
        "lng": 74.94897086596681
    },
    {
        "lat": 16.78747030445358,
        "lng": 74.90502555346681
    },
    {
        "lat": 16.576991828293913,
        "lng": 74.63586051440431
    },
    {
        "lat": 16.613842268002696,
        "lng": 74.52050406909181
    },
    {
        "lat": 16.53486840025444,
        "lng": 74.25133903002931
    },
    {
        "lat": 16.229199828918144,
        "lng": 74.35570914721681
    },
    {
        "lat": 16.070908346421724,
        "lng": 74.49303824877931
    },
    {
        "lat": 15.679919269752945,
        "lng": 74.33373649096681
    },
    {
        "lat": 15.690496484311224,
        "lng": 74.10851676440431
    },
    {
        "lat": 15.155668763798268,
        "lng": 74.31176383471681
    },
    {
        "lat": 14.916940041243654,
        "lng": 74.07555778002931
    },
    {
        "lat": 14.662003773233234,
        "lng": 74.48754508471681
    },
    {
        "lat": 15.017769192859118,
        "lng": 74.59191520190431
    },
    {
        "lat": 15.213983887703519,
        "lng": 74.62487418627931
    },
    {
        "lat": 15.378239508644706,
        "lng": 74.80065543627931
    },
    {
        "lat": 15.56882548589396,
        "lng": 74.86108024096681
    },
    {
        "lat": 15.6428947043004,
        "lng": 75.10277945971681
    },
    {
        "lat": 15.621734800415103,
        "lng": 75.35546500659181
    },
    {
        "lat": 15.827950240996003,
        "lng": 75.47082145190431
    },
    {
        "lat": 16.06035108567532,
        "lng": 75.55321891284181
    },
    {
        "lat": 16.223925489219912,
        "lng": 75.31151969409181
    },
    {
        "lat": 16.36101228505021,
        "lng": 75.23461539721681
    },
    {
        "lat": 16.53486840025444,
        "lng": 75.26208121752931
    },
    {
        "lat": 16.682260030197977,
        "lng": 75.21813590502931
    },
    {
        "lat": 16.834795942963243,
        "lng": 75.49279410815431
    },
    {
        "lat": 16.95568544869833,
        "lng": 75.41588981127931
    }
]
  }

  selectedOrders:any = []
  onMarkerClick(marker: any) {
    console.log(marker)
    this.selectedMarker = marker;
    this.ordersSelected = !this.ordersSelected
    if(this.selectedOrders.includes(this.selectedMarker.lat)){
      const index = this.selectedOrders.indexOf(marker.lat);
      this.selectedOrders.splice(index, 1);
    } else {
      let value = this.allVisits.find((user:any) => user.id === marker['id'])
      value['status'] = 'selected'
      this.selectedOrders = []
      this.selectedOrders.push(value)
      console.log(this.selectedOrders)
    }
    
    // alert(`click on ${marker.lat} - ${this.ordersSelected}`);
  }

  ordersCountByStatus(type: string): number {
  return this.generatedPoints.filter(item => item.status === type).length;
}

getAllVisits() {
  this.isLoading = true;
  this.commonService.getAllVisits().subscribe({
    next: (res: any) => {
      this.isLoading = false;
      
      // Directly assign since `res` is an array
      this.allVisits = res.visits.reverse();
      this.visitsName =  `All Visits (${this.allVisits.length})`

      // Build generatedPoints
      this.generatedPoints = this.allVisits.map((element: any) => ({
        lat: Number(element.lat),
        lng: Number(element.lng),
        id: element.id,
        status: 'new'
      }));

      console.log('Generated Points:', this.generatedPoints);
    },
    error: (error) => {
      console.error('Failed to retrieve visits:', error);
      this.isLoading = false;
    }
  });
}

openMap(lat: number, lng: number) {
  // Construct the Google Maps URL
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  console.log(url)

  // Open in new tab (browser) or in system app on mobile
  window.open(url, '_blank');
}


}
