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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-normal-users',
  imports: [CommonModule, EmptyDataComponent, LoaderComponent, MatButtonModule, MatDialogModule, FormsModule],
  templateUrl: './normal-users.component.html',
  styleUrl: './normal-users.component.css'
})
export class NormalUsersComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  normalUsers: any;
  filteredUsers: any;
  searchQuery: string = '';
  isUsersLoading: boolean = false

  constructor(private http:HttpClient, private commonService: CommonService, private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
      if (isPlatformBrowser(this.platformId)) {
        this.getUsers()
      }
      this.cdr.detectChanges();
  }

  addNewUser(){
    const dialogRef = this.dialog.open(AddUsersComponent, {
        data: {type: 'add'},
        maxWidth: '75vw',
        disableClose: true,
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
        disableClose: true,
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
      "token": isPlatformBrowser(this.platformId) ? sessionStorage.getItem('token') : ''
    }
    this.isUsersLoading = true
      this.commonService.getAllNormalUsers(params).subscribe((res:any)=> {
        this.isUsersLoading = false
          this.normalUsers = res.data
          this.filteredUsers = res.data
          this.cdr.detectChanges();
      }, error => {
        this.isUsersLoading = false
      })
  }  

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredUsers = this.normalUsers;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredUsers = this.normalUsers.filter((user: any) =>
        user.first_name?.toLowerCase().includes(query) ||
        user.last_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query) ||
        user.phone?.includes(query)
      );
    }
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
