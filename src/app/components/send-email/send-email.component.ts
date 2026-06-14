import { Component, Inject, OnInit } from '@angular/core';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-send-email',
  imports: [
    ButtonSpinnerComponent,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent implements OnInit {
  toEmail: string = '';
  subject: string = '';
  message: string = '';
  isSending: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<SendEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Pre-fill the email address if passed in through the dialog data
    if (this.data && this.data.email) {
      this.toEmail = this.data.email;
    }
  }

  sendEmail(): void {
    this.isSending = true;
    
    // TODO: Connect this to your actual email sending API in CommonService
    setTimeout(() => {
      this.isSending = false;
      this.dialogRef.close(true); // Close the dialog and return a success indicator
    }, 1500);
  }
}
