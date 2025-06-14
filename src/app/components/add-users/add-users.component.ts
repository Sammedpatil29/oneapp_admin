import {ChangeDetectionStrategy, Component, Inject, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";

@Component({
  selector: 'app-add-users',
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, ButtonSpinnerComponent],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.css'
})
export class AddUsersComponent implements OnInit{

  firstName = ''
  lastName = ''
  contact = ''
  email = ''
  role = ''
  password = ''
  isActive: boolean = true
  isLoading: boolean = false

constructor( @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService, private dialogRef: MatDialogRef<AddUsersComponent>){
    console.log(data)
  }

ngOnInit(): void {
    
}

createUser(){
  let params = {
    "token": sessionStorage.getItem('token'),
    "email": this.email,
    "first_name": this.firstName,
    "last_name": this.lastName,
    "profile_image": "",
    "phone": this.contact,
    "is_active": this.isActive,
    "is_verified": true,
    "role": this.role,
    "password_field": this.password
}
this.isLoading = true
this.commonService.createUser(params).subscribe((res)=>{
  alert("user added successfully")
  this.isLoading = false
  this.dialogRef.close();
}, error => {
  this.isLoading = false
  alert("error while adding user")
})
}
}
