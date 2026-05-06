import {ChangeDetectionStrategy, Component, Inject, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';
import { CommonModule } from '@angular/common';
import { AddUsersComponent } from '../add-users/add-users.component';

@Component({
  selector: 'app-rider-dialog',
  imports: [MatDialogModule, MatButtonModule, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, ButtonSpinnerComponent],
  templateUrl: './rider-dialog.component.html',
  styleUrl: './rider-dialog.component.css'
})
export class RiderDialogComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  name = ''
  contact = ''
  role = 'rider'
  vehicle_number = ''
  vehicle_type = ''
  fuel_type = ''
  vehicle_model = ''
  status = 'offline'
  is_verified: boolean = false
  isLoading: boolean = false
  riderUpdating: boolean = false
  isDeleting: boolean = false
  
  vehicleTypes: any = ["bike", "scooter", "car", "van"]
  fuelTypes: any = ["petrol", "diesel", "ev", "cng"]
  statuses: any = ["online", "offline", "busy"]

constructor( @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService, private dialogRef: MatDialogRef<RiderDialogComponent>){
    console.log(data)
  }

ngOnInit(): void {
    if(this.data.type == 'edit'){
      this.name = this.data.item.name || '';
      this.contact = this.data.item.contact || '';
      this.role = this.data.item.role || 'rider';
      this.vehicle_number = this.data.item.vehicle_number || '';
      this.vehicle_type = this.data.item.vehicle_type || '';
      this.fuel_type = this.data.item.fuel_type || '';
      this.vehicle_model = this.data.item.vehicle_model || '';
      this.status = this.data.item.status || 'offline';
      this.is_verified = this.data.item.is_verified || false;
    }
}

createRider(){
  let params = {
      "name": this.name,
      "contact": this.contact,
      "role": this.role,
      "vehicle_number": this.vehicle_number,
      "vehicle_type": this.vehicle_type,
      "fuel_type": this.fuel_type,
      "vehicle_model": this.vehicle_model,
      "status": this.status,
      "is_verified": this.is_verified
}
this.isLoading = true
// Replace with your actual create rider service method if it differs
this.commonService.createUser(params).subscribe((res)=>{
  this.isLoading = false
  this.dialog.open(AlertdialogComponent, {
    data: {
            title: 'success',
            body: 'Rider added successfully',
            type: 'success'
          }
  })
  this.dialogRef.close();
}, error => {
  this.isLoading = false
  this.dialog.open(AlertdialogComponent, {
    data: {
            title: 'error',
            body: 'Error while adding rider',
            type: 'error'
          }
  })
})
}

updateRider(){
  let params = {
    "token": sessionStorage.getItem('token'),
    "name": this.name,
    "contact": this.contact,
    "role": this.role,
    "vehicle_number": this.vehicle_number,
    "vehicle_type": this.vehicle_type,
    "fuel_type": this.fuel_type,
    "vehicle_model": this.vehicle_model,
    "status": this.status,
    "is_verified": this.is_verified
  }
  this.riderUpdating = true
  // Replace with your actual update rider service method if it differs
  this.commonService.updateUser(this.data.item.id, params).subscribe(res => {
    this.dialog.open(AlertdialogComponent, {
      data: {
              title: 'success',
              body: 'Rider updated successfully',
              type: 'success'
            }
    })
    this.riderUpdating = false
    this.dialogRef.close();
  }, error => {
    this.riderUpdating = false
    this.dialog.open(AlertdialogComponent, {
      data: {
              title: 'error',
              body: 'Error while updating rider',
              type: 'error'
            }
    })
  })
}

count = 0
  deleteRider(){
    let params = {
      "token": sessionStorage.getItem('token')
    }
    this.count = this.count + 1
    if(this.count == 10){
      this.isDeleting = true
      // Replace with your actual delete rider service method if it differs
      this.commonService.deleteUser(this.data.item.id, params).subscribe(res=>{
        this.dialog.open(AlertdialogComponent, {
          data: {
                  title: 'success',
                  body: 'Rider deleted successfully',
                  type: 'success'
                }
        })
        this.isDeleting = false
        this.dialogRef.close();
      }, error => {
        this.isDeleting = false
        this.dialog.open(AlertdialogComponent, {
          data: {
                  title: 'error',
                  body: 'Error while deleting rider',
                  type: 'error'
          }
        })
      })
    }

  }
}
