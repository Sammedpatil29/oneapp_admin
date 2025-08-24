import { Component, Inject, OnInit } from '@angular/core';
import {ChangeDetectionStrategy, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import { CommonService } from '../../services/common.service';
import {MatSelectModule} from '@angular/material/select';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatIcon} from '@angular/material/icon';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { signal} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { DialogRef } from '@angular/cdk/dialog';
import { ButtonSpinnerComponent } from "../button-spinner/button-spinner.component";
import { AlertdialogComponent } from '../../alertdialog/alertdialog.component';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-edit-events',
  providers: [provideNativeDateAdapter()],
  imports: [MatDialogModule, MatFormFieldModule, MatChipsModule, MatIconModule, MatTimepickerModule, MatIcon, MatInputModule, MatDatepickerModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule, ButtonSpinnerComponent],
  templateUrl: './edit-events.component.html',
  styleUrl: './edit-events.component.css'
})
export class EditEventsComponent implements OnInit{
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly fruits = signal<Fruit[]>([{name: 'Lemon'}, {name: 'Lime'}, {name: 'Apple'}]);
  readonly announcer = inject(LiveAnnouncer);
  readonly dialog = inject(MatDialog);


  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonService,  private dialogRef: MatDialogRef<EditEventsComponent>){
    console.log(data)
   
  }
  
metaData: any = []
cities: any;
status: any = [];
title = ''
description = ''
offers = ''
location = ''
lat = ''
lng = ''
duration = ''
selectedStatus = ''
organiser: any
selectedCities: any
imgUrl = ''
registrationUrl = ''
recurence = ''
category: any
selectedCategory = ''
email = '' 
contact = '' 
ticketPrice = '' 
ticketCount = '' 
isFree: boolean = false
date: any;
time: any;
isLoading: boolean = false
token: any;
is_active: boolean = true
isDeleting: boolean = false


ngOnInit(): void {
    this.token = sessionStorage.getItem('token')
    if(this.data.type == 'edit'){
        this.title = this.data.item.title
        this.description = this.data.item.description
        this.location = this.data.item.location.location
        this.lat = this.data.item.location.lat
        this.lng = this.data.item.location.lng
        this.selectedStatus = this.data.item.status
        this.duration = this.data.item.duration
        this.organiser = this.data.item.organizer
        this.imgUrl = this.data.item.imageUrl
        this.recurence = this.data.item.recurrence
        this.registrationUrl = this.data.item.registrationUrl
        this.category = this.data.item.category
        this.email = this.data.item.email
        this.contact = this.data.item.contact
        this.ticketPrice = this.data.item.ticketPrice
        this.ticketCount = this.data.item.ticketcount
        this.isFree = this.data.item.isFree
        this.date = this.data.item.date
        this.time = this.data.item.time
        this.isFree = this.data.item.isFree
        this.is_active = this.data.item.is_active
      }
}

add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.update(fruits => [...fruits, {name: value}]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: Fruit): void {
    this.fruits.update(fruits => {
      const index = fruits.indexOf(fruit);
      if (index < 0) {
        return fruits;
      }

      fruits.splice(index, 1);
      this.announcer.announce(`Removed ${fruit.name}`);
      return [...fruits];
    });
  }

  edit(fruit: Fruit, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(fruit);
      return;
    }

    // Edit existing fruit
    this.fruits.update(fruits => {
      const index = fruits.indexOf(fruit);
      if (index >= 0) {
        fruits[index].name = value;
        return [...fruits];
      }
      return fruits;
    });
  }

  createEvent(){
      let params = {
  "token": this.token,
    "title": this.title,
    "description": this.description,
    "location": {
      "location": this.location,
      "lat": this.lat,
      "lng": this.lng
    },
    "date": this.date.toISOString().split('T')[0],
    "time": this.time,
    "duration": this.duration,
    "category": 'events',
    "tags": "hfrufhufurf",
    "organizer": this.organiser,
    "contact": this.contact,
    "email": this.email,
    "isFree": this.isFree,
    "ticketPrice": this.ticketPrice,
    "ticketcount": this.ticketCount,
    "imageUrl": this.imgUrl,
    "registrationUrl": this.registrationUrl,
    "recurrence": this.recurence
      }
      this.isLoading = true
      this.commonService.createEvent(params).subscribe((res)=> {
        // alert('Event created successfully')
        this.dialog.open(AlertdialogComponent, {
                  data: {
                    title: 'success',
                    body: 'Event created successfully',
                    type: 'success'
                  }
                });
        this.isLoading = false
        this.dialogRef.close();
      }, error => {
        this.isLoading = false
        this.dialog.open(AlertdialogComponent, {
                  data: {
                    title: 'error',
                    body: 'Error While creating event',
                    type: 'error'
                  }
                });
      })
    }

    deleteEvent(){
      let params = {
        "token": this.token
      }
      this.isDeleting = true
      this.commonService.deleteEvent(this.data.item.id, params).subscribe((res)=> {
        this.dialog.open(AlertdialogComponent, {
                  data: {
                    title: 'success',
                    body: 'Event deleted successfully',
                    type: 'success'
                  }
                });
        this.isDeleting = false
        this.dialogRef.close();
      },error => {
        this.isDeleting = false
        this.dialog.open(AlertdialogComponent, {
                  data: {
                    title: 'error',
                    body: 'Error while deleting Event',
                    type: 'error'
                  }
                });
      })
    }  

    formatDate(){
        const hours = this.time.getHours().toString().padStart(2, '0'); 
      const minutes = this.time.getMinutes().toString().padStart(2, '0')
      this.time = `${hours}:${minutes}`
      console.log(this.time)
    }


    updateEvent(){
      let params = {
        "token": this.token,
        "title": this.title,
        "description": this.description,
        "location": {
            "lat": this.lat,
            "lng": this.lng,
            "location": this.location
        },
        "date": this.date,
        "time": this.time,
        "duration": this.duration,
        "category": "events",
        "tags": "hfrufhufurf",
        "organizer": this.organiser,
        "contact": this.contact,
        "email": this.email,
        "ticketcount": this.ticketCount,
        "is_active": this.is_active,
        "ticketoptions": [],
        "isFree": this.isFree,
        "ticketPrice": this.ticketPrice,
        "imageUrl": this.imgUrl,
        "registrationUrl": this.registrationUrl,
        "recurrence": this.recurence,
        "user": null
    }
    this.isLoading = true
    this.commonService.editEvent(this.data.item.id, params).subscribe((res)=> {
      this.dialog.open(AlertdialogComponent, {
                  data: {
                    title: 'success',
                    body: 'Event updated successfully',
                    type: 'success'
                  }
                });
      this.isLoading = false
      this.dialogRef.close();
      
    }, error => {
      this.isLoading = false
      this.dialog.open(AlertdialogComponent, {
                  data: {
                    title: 'success',
                    body: 'Error while updating Event',
                    type: 'success'
                  }
                });
    })
    }


}

