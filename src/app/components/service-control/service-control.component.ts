import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { LoaderComponent } from "../loader/loader.component";
import {ChangeDetectionStrategy, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddEditServicesComponent } from '../add-edit-services/add-edit-services.component';
import { CommonModule } from '@angular/common';
import { unsubscribe } from 'diagnostics_channel';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-service-control',
  imports: [RouterLink, LoaderComponent, MatButtonModule, MatDialogModule, CommonModule],
  templateUrl: './service-control.component.html',
  styleUrl: './service-control.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceControlComponent implements OnInit{
  readonly dialog = inject(MatDialog);  
services: any;
isLoading: boolean = false
  constructor(private commonService: CommonService, private cdr: ChangeDetectorRef){
  }

  ngOnInit() {
      this.getServices()
  }

  getServices(){
    this.isLoading = true
    this.commonService.getServices().subscribe((res)=>{
      this.isLoading = false
        this.services = res
        this.cdr.detectChanges();
        console.log(this.services)
    })
  }

  openDialog(item:any) {
    const dialogRef = this.dialog.open(AddEditServicesComponent, {
      data: {item: item, type: 'edit'},
      maxWidth: '75vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == true){
          this.getServices()
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogToAddService() {
    const dialogRef = this.dialog.open(AddEditServicesComponent, {
      data: {type: 'add'},
      maxWidth: '75vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  getStatusClass(status: string): string {
  switch (status) {
    case 'active':
      return 'text-success';
    case 'coming_soon':
      return 'text-warning'; 
    case 'not_available':
      return 'text-danger'; 
    default:
      return '';
  }
}

statusMap: { [key: string]: string } = {
  coming_soon: "Coming Soon",
  active: "Active",
  not_available: "Not Available",
}

}
