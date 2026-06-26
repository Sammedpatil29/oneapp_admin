import { CommonService } from './../../services/common.service';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

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
readonly dialog = inject(MatDialog);
  constructor(
    public dialogRef: MatDialogRef<SendEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService
  ) {}

  ngOnInit(): void {
    // Pre-fill the email address if passed in through the dialog data
    if (this.data && this.data.email) {
      this.toEmail = this.data.email;
    }
  }

  sendEmail(): void {
    this.isSending = true;
    const params = {
      to: this.toEmail,
      subject: this.subject,
      body: this.message
    };
    this.commonService.sendEmail(params).subscribe((res: any) => {
      this.isSending = false;
      this.dialogRef.close();
      this.dialog.open(AlertdialogComponent, {
        data: {
              title: 'success',
              body: `Email Sent Successfully`,
              type: 'success',
            },
      })
    }, error => {
      this.isSending = false;
      this.dialog.open(AlertdialogComponent, {
        data: {
              title: 'error',
              body: `Failed to send email`,
              type: 'error',
            },
      })
    });
  }
}
