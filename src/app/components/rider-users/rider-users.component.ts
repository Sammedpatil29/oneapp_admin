import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { LoaderComponent } from "../loader/loader.component";
import {ChangeDetectionStrategy, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddUsersComponent } from '../add-users/add-users.component';
import { OrdersService } from '../../services/orders.service';
import { RiderDialogComponent } from '../rider-dialog/rider-dialog.component';

@Component({
  selector: 'app-rider-users',
  imports: [CommonModule, EmptyDataComponent, LoaderComponent, MatButtonModule, MatDialogModule],
  templateUrl: './rider-users.component.html',
  styleUrl: './rider-users.component.css'
})
export class RiderUsersComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  riders: any;
  isUsersLoading: boolean = false

  constructor(private http:HttpClient, private ordersService: OrdersService, private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.getRiders()
      }
      this.cdr.detectChanges();
  }

  addNewUser(){
    const dialogRef = this.dialog.open(RiderDialogComponent, {
        data: {type: 'add'},
        maxWidth: '75vw',
        disableClose: true,
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined || result == 'true'){
        this.getRiders()
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(item:any){
    const dialogRef = this.dialog.open(RiderDialogComponent, {
        data: {item: item, type: 'edit'},
        maxWidth: '75vw',
        disableClose: true,
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined || result == 'true'){
        this.getRiders()
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  getRiders(){
    this.isUsersLoading = true
    this.ordersService.getRiders().subscribe((res:any)=>{
      this.riders = res;
      this.isUsersLoading = false
    })
    
  } 

  getStatus(isActive:any){
    if(isActive){
      return 'Active'
    } else {
      return 'Inactive'
    }
  }

  getStatusColor(isActive:any){
    if(isActive){
      return 'text-success'
    } else {
      return 'text-danger'
    }
  }
}
