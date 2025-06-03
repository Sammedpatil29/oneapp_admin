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

@Component({
  selector: 'app-metadata',
  imports: [MatDialogModule, CommonModule, MatButtonModule, FormsModule, MatFormFieldModule,MatExpansionModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, LoaderComponent],
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

polygonCoords: google.maps.LatLngLiteral[] = [
  { lat: 16.721820, lng: 75.041123 },
  { lat: 16.731534, lng: 75.044394 },
  { lat: 16.733517, lng: 75.050348 },
  { lat: 16.736431, lng: 75.062371 },
  { lat: 16.727415, lng: 75.075158 },
  { lat: 16.716180, lng: 75.073141 },
  { lat: 16.704540, lng: 75.067789 },
  { lat: 16.709470, lng: 75.055160 },
  { lat: 16.714950, lng: 75.044911 },
];


@ViewChild('mapContainer', { static: false }) mapContainer: any;
  map!: google.maps.Map;
  drawingManager!: google.maps.drawing.DrawingManager;

  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getMetaData()
      this.getbanners()
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  getMetaData(){
    this.isMetaDataLoading = true
    this.commonService.getMetaData().subscribe(res => {
        this.metaData = res
        this.latest_version = this.metaData.latest_version
        this.download_link = this.metaData.download_link
        this.last_updated = this.metaData.last_updated
        this.otherDetails = this.metaData.video
        this.isMetaDataLoading = false
         const parsed = JSON.parse(this.otherDetails);
    this.otherDetails = JSON.stringify(parsed, null, 10)
        
    })
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

  updateBanner(id:any, img:any, route:any){
    let params = {
      "img": img,
      "route": route
    }
    console.log(params)
    console.log('updating')
    this.commonService.updateBanner(id, params).subscribe((res)=> {
      this.getbanners()
      alert("banner updated successfully")
    })
  }

  initMap(): void {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 16.7218, lng: 75.0503 },
      zoom: 14,
    });

    // Set up DrawingManager for polygons only
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        fillColor: '#2196F3',
        fillOpacity: 0.4,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    this.drawingManager.setMap(this.map);

    // Listen for completion of polygon
    google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event:any) => {
      if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        const polygon = event.overlay as google.maps.Polygon;
        this.polygonCoords = polygon.getPath().getArray().map(latlng => ({
          lat: latlng.lat(),
          lng: latlng.lng(),
        }));
        console.log('Polygon Coordinates:', this.polygonCoords);
        this.drawingManager.setDrawingMode(null); // Disable further drawing
      }
    });

    if (this.polygonCoords.length > 0) {
  const defaultPolygon = new google.maps.Polygon({
    paths: this.polygonCoords,
    fillColor: '#2196F3',
    fillOpacity: 0.4,
    strokeWeight: 2,
    clickable: true,
    editable: true,
    zIndex: 1,
  });

  defaultPolygon.setMap(this.map);

  // Optional: Replace existing polygon on edit
  google.maps.event.addListener(defaultPolygon.getPath(), 'set_at', () => {
    this.polygonCoords = defaultPolygon.getPath().getArray().map(p => ({
      lat: p.lat(),
      lng: p.lng(),
    }));
  });

  google.maps.event.addListener(defaultPolygon.getPath(), 'insert_at', () => {
    this.polygonCoords = defaultPolygon.getPath().getArray().map(p => ({
      lat: p.lat(),
      lng: p.lng(),
    }));
  });
}

  }

  exportAsJson(): void {
    console.log(this.polygonCoords)
    const mapData = {
      serviceableArea: this.polygonCoords,
    };
    const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'map.json';
    a.click();
    URL.revokeObjectURL(url);
  }

}
