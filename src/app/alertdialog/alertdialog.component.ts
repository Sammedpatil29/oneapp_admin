import {ChangeDetectionStrategy, Component, Inject, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-alertdialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './alertdialog.component.html',
  styleUrl: './alertdialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertdialogComponent {
  readonly dialog = inject(MatDialog);

  title: string;
  body: string;
  type: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    this.title = data.title;
    this.body = data.body;
    this.type = data.type;
  }
}
