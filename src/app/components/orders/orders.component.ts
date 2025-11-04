import { Component, OnInit } from '@angular/core';
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { GoogleMapsModule } from '@angular/google-maps';
import {MatChipsModule} from '@angular/material/chips';
import { CommonService } from '../../services/common.service';
import { LoaderComponent } from "../loader/loader.component";
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-orders',
  imports: [EmptyDataComponent, GoogleMapsModule, MatChipsModule, LoaderComponent, MatTabsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit{
 readonly chipsOptions: string[] = ['Map View', 'List View'];
orders: any;
isLoading: boolean = false
ordersSelected: boolean = true
showSideBox: boolean = true
deliveryOrder: boolean = true
orderType: string = 'Delivery'

 markerIcon: any = {
  new: {
    url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
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
  zoom = 14;

  polygonPaths: google.maps.LatLngLiteral[] = []

  generatedPoints: { lat: number; lng: number; status: string }[] = [
  { lat: 16.719841, lng: 75.050290, status: 'new' },
  { lat: 16.723528, lng: 75.057112, status: 'confirmed' },
  { lat: 16.715672, lng: 75.061847, status: 'packed' },
  { lat: 16.724905, lng: 75.069351, status: 'outForDelivery' },
  { lat: 16.712384, lng: 75.058297, status: 'delivered' },
  { lat: 16.725312, lng: 75.046832, status: 'new' },
  { lat: 16.730182, lng: 75.059740, status: 'confirmed' },
  { lat: 16.710473, lng: 75.067132, status: 'packed' },
  { lat: 16.717918, lng: 75.053958, status: 'outForDelivery' },
  { lat: 16.726631, lng: 75.063280, status: 'delivered' },
  { lat: 16.714950, lng: 75.044911, status: 'new' }
];


  selectedMarker: any = ''

  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getOrders()
      this.commonService.getPolygonData().subscribe((res:any) => {
        console.log(res)
        this.polygonPaths = res.polygon
      })
  }

  selectedOrders:any = []
  onMarkerClick(marker: google.maps.LatLngLiteral) {
    this.selectedMarker = marker;
    this.ordersSelected = !this.ordersSelected
    if(this.selectedOrders.includes(this.selectedMarker.lat)){
      const index = this.selectedOrders.indexOf(marker.lat);
      this.selectedOrders.splice(index, 1);
    } else {
      this.selectedOrders.push(this.selectedMarker.lat)
    }
    
    // alert(`click on ${marker.lat} - ${this.ordersSelected}`);
  }

  getOrders(){
    let params = {
      "token": sessionStorage.getItem("token")
    }
    this.isLoading = true
    this.commonService.getOrders(params).subscribe((res)=>{
      this.orders = res
      this.isLoading = false
      console.log(this.orders)
    } )
  }

  ordersCountByStatus(type: string): number {
  return this.generatedPoints.filter(item => item.status === type).length;
}

changeDeliveryMode(){
  this.deliveryOrder = !this.deliveryOrder
  if(this.deliveryOrder == true){
    this.orderType = 'Delivery'
  } else {
    this.orderType = 'Non-delivery'
  }
}
}
