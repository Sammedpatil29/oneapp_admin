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
strokeColor = ''
areaColor = ''
isMapUpdateLoading: boolean = false

polygonCoords: google.maps.LatLngLiteral[] = [];


@ViewChild('mapContainer', { static: false }) mapContainer: any;
  map!: google.maps.Map;
  drawingManager!: google.maps.drawing.DrawingManager;

  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getMetaData()
      this.getbanners()
      this.getPolygonData()
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  getPolygonData(){
    console.log('polygon called')
    this.commonService.getPolygonData().subscribe((res: any)=>{
      this.polygonCoords = res.polygon
      this.areaColor = res.inside_color
      this.strokeColor = res.border_color
      console.log(this.polygonCoords)
    })
  }

  updatePolygonData(){
    this.isMapUpdateLoading = true
    let params = {
      "center": {
        "lat": 16.715316578418758,
        "lng": 75.05882421691895
    },
    "polygon": this.polygonCoords,
    "inside_color": this.areaColor,
    "border_color": this.strokeColor
    }
    this.commonService.updatePlygonData(params).subscribe((res)=> {
      console.log('coords updated successfully')
      this.isMapUpdateLoading = false
    }, error => {
      this.isMapUpdateLoading = false
    })
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
        fillColor: this.areaColor,
        fillOpacity: 0.4,
        strokeColor: this.strokeColor,
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
    fillColor: this.areaColor,
    fillOpacity: 0.4,
    strokeColor: this.strokeColor,
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
