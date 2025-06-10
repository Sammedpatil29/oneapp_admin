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
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit{
 events: any;
 isLoading: boolean = false
 readonly dialog = inject(MatDialog);  
  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getEvents()
  }

  getEvents(){
    this.events = []
    let params = {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJwaG9uZSI6Iis5MTk1OTE0MjAwNjgiLCJ1c2VyX25hbWUiOiJzYW1tZWQiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0OTQ2MDI4Mn0.tO4XklsZN3Qw4QLHNctoEgW59dk3pOWAeF7qO8Imv8s"
    }
    this.isLoading = true
    this.commonService.getEvents(params).subscribe((res:any)=>{
      this.events = res
      this.isLoading = false
      console.log(this.events)
    }, error => {
      this.isLoading = false
    })
  }

  openDialogToAddService() {
      const dialogRef = this.dialog.open(EditEventsComponent, {
        data: {type: 'add'},
        maxWidth: '75vw',
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if(result == true){
          this.getEvents()
        }
       
        console.log(`Dialog result: ${result}`);
      });
    }

    
}
