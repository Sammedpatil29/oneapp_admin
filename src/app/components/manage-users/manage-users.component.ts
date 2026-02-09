import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { LoaderComponent } from "../loader/loader.component";
import {ChangeDetectionStrategy, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { AddUsersComponent } from '../add-users/add-users.component';

@Component({
  selector: 'app-manage-users',
  imports: [CommonModule, EmptyDataComponent, LoaderComponent, MatButtonModule, MatDialogModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageUsersComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  allUsers: any;
  isUsersLoading: boolean = false

  constructor(private http:HttpClient, private commonService: CommonService, private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
      this.getUsers()
      this.cdr.detectChanges();
  }

  addNewUser(){
    const dialogRef = this.dialog.open(AddUsersComponent, {
        data: {type: 'add'},
        maxWidth: '75vw',
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined || result == 'true'){
        this.getUsers()
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditDialog(item:any){
    const dialogRef = this.dialog.open(AddUsersComponent, {
        data: {item: item, type: 'edit'},
        maxWidth: '75vw',
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result == undefined || result == 'true'){
        this.getUsers()
      }
      console.log(`Dialog result: ${result}`);
    });
  }

  getUsers(){
    let params = {
      "token": sessionStorage.getItem('token')
    }
    this.isUsersLoading = true
      this.commonService.getAllUsers(params).subscribe((res:any)=> {
        this.isUsersLoading = false
          this.allUsers = res.data
      }, error => {
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
