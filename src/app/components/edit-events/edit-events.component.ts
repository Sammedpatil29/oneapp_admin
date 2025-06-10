import { Component, Inject } from '@angular/core';
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
export class EditEventsComponent {
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly fruits = signal<Fruit[]>([{name: 'Lemon'}, {name: 'Lime'}, {name: 'Apple'}]);
  readonly announcer = inject(LiveAnnouncer);


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
isFree: boolean = false
date: any;
time: any;
isLoading: boolean = false

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
    const hours = this.time.getHours().toString().padStart(2, '0'); // Get hours and pad if single digit
const minutes = this.time.getMinutes().toString().padStart(2, '0')
      let params = {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJwaG9uZSI6Iis5MTk1OTE0MjAwNjgiLCJ1c2VyX25hbWUiOiJzYW1tZWQiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0OTQ2MDI4Mn0.tO4XklsZN3Qw4QLHNctoEgW59dk3pOWAeF7qO8Imv8s",
    "title": this.title,
    "description": this.description,
    "location": {
      "location": this.location,
      "lat": this.lat,
      "lng": this.lng
    },
    "date": this.date.toISOString().split('T')[0],
    "time": `${hours}:${minutes}`,
    "duration": this.duration,
    "category": 'events',
    "tags": "hfrufhufurf",
    "organizer": this.organiser,
    "contact": 'adajdaf@gmail.com',
    "isFree": this.isFree,
    "ticketPrice": this.ticketPrice,
    "imageUrl": this.imgUrl,
    "registrationUrl": this.registrationUrl,
    "recurrence": this.recurence
      }
      this.isLoading = true
      this.commonService.createEvent(params).subscribe((res)=> {
        alert('Event created successfully')
        this.isLoading = false
        this.dialogRef.close();
      }, error => {
        this.isLoading = false
        alert('error while adding event')
      })
    }


}

