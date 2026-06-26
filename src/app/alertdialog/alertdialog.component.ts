import {ChangeDetectionStrategy, Component, Inject, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-alertdialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule, DragDropModule],
  templateUrl: './alertdialog.component.html',
  styleUrl: './alertdialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertdialogComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  title: string;
  body: string;
  type: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    this.title = data.title;
    this.body = data.body;
    this.type = data.type;
  }

  ngOnInit(): void {
    this.playSound();
  }

  playSound() {
    const audio = new Audio('assets/dialog-open.mp3'); 
    audio.load();
    audio.play().catch(err => console.error('Audio playback failed:', err));
  }
}
