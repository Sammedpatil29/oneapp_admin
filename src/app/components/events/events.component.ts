import { Component, inject, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { LoaderComponent } from "../loader/loader.component";
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { CommonModule } from '@angular/common';
import { EditEventsComponent } from '../edit-events/edit-events.component';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { title } from 'process';

@Component({
  selector: 'app-events',
  imports: [LoaderComponent, EmptyDataComponent, CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  events: any;
  isLoading: boolean = false;
  token: any;
  view = 'table';
  readonly dialog = inject(MatDialog);
  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.events = [];
    this.token = sessionStorage.getItem('token');
    let params = {
      token: this.token,
    };
    this.isLoading = true;
    this.commonService.getEvents(params).subscribe(
      (res: any) => {
        this.events = res;
        this.isLoading = false;
        console.log(this.events);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  openDialogToAddEvent() {
    const dialogRef = this.dialog.open(EditEventsComponent, {
      data: { type: 'add' },
      maxWidth: '75vw',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true || result == undefined) {
        this.getEvents();
      }

      console.log(`Dialog result: ${result}`);
    });
  }

  editEvent(item: any) {
    console.log('edit event');
    const dialogRef = this.dialog.open(EditEventsComponent, {
      data: { item: item, type: 'edit' },
      maxWidth: '75vw',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true || result == undefined) {
        this.getEvents();
      }

      console.log(`Dialog result: ${result}`);
    });
  }

  getStatus(status: any) {
    if(status == true){
      return 'Active'
    } else {
      return 'Inactive'
    }
  }

  getStatusColor(status: any) {
    if(status == true){
      return 'text-success'
    } else {
      return 'text-danger'
    }
  }
}
