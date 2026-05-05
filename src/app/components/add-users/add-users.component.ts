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

@Component({
  selector: 'app-add-users',
  imports: [MatDialogModule, MatButtonModule, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, ButtonSpinnerComponent],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.css'
})
export class AddUsersComponent implements OnInit{
  readonly dialog = inject(MatDialog);
  firstName = ''
  lastName = ''
  contact = ''
  email = ''
  role = ''
  password = ''
  isActive: boolean = true
  isLoading: boolean = false
  userUpdating: boolean = false
  isDeleting: boolean = false
  roles: any = ["admin", "vendor", "editor", "verifier", "manager", "support", "auditor", "analyst", "moderator", "guest"]

constructor( @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService, private dialogRef: MatDialogRef<AddUsersComponent>){
    console.log(data)
  }

ngOnInit(): void {
    if(this.data.type == 'edit'){
      this.firstName = this.data.item.first_name,
      this.lastName = this.data.item.last_name,
      this.contact = this.data.item.phone,
      this.email = this.data.item.email,
      this.role = this.data.item.role,
      this.password = this.data.item.password_field,
      this.isActive = this.data.item.is_active
    }
}

createUser(){
  let params = {
    "email": this.email,
      "password": this.password,
      "first_name": this.firstName,
      "last_name": this.lastName,
      "phone": this.contact,
      "role": this.role
}
this.isLoading = true
this.commonService.createUser(params).subscribe((res)=>{
  this.isLoading = false
  this.dialog.open(AlertdialogComponent, {
    data: {
            title: 'success',
            body: 'User added successfully',
            type: 'success'
          }
  })
  this.dialogRef.close();
}, error => {
  this.isLoading = false
  this.dialog.open(AlertdialogComponent, {
    data: {
            title: 'error',
            body: 'Error while adding user',
            type: 'error'
          }
  })
})
}

updateUser(){
  let params = {
    "token": sessionStorage.getItem('token'),
    "first_name": this.firstName,
    "last_name": this.lastName,
    "password_field": this.password,
    "is_active": this.isActive,
    "role": this.role,
    "contact": this.contact,
    "email": this.email
  }
  this.userUpdating = true
  this.commonService.updateUser(this.data.item.id, params).subscribe(res => {
    this.dialog.open(AlertdialogComponent, {
      data: {
              title: 'success',
              body: 'User updated successfully',
              type: 'success'
            }
    })
    this.userUpdating = false
    this.dialogRef.close();
  }, error => {
    this.userUpdating = false
    this.dialog.open(AlertdialogComponent, {
      data: {
              title: 'error',
              body: 'Error while updating user',
              type: 'error'
            }
    })
  })
}

count = 0
  deleteUser(){
    let params = {
      "token": sessionStorage.getItem('token')
    }
    this.count = this.count + 1
    if(this.count == 10){
      this.isDeleting = true
      this.commonService.deleteUser(this.data.item.id, params).subscribe(res=>{
        this.dialog.open(AlertdialogComponent, {
          data: {
                  title: 'success',
                  body: 'User deleted successfully',
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
                  body: 'Error while deleting user',
                  type: 'error'
          }
        })
      })
    }

  }
}
