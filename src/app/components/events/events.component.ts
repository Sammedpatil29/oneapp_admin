import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { LoaderComponent } from "../loader/loader.component";
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events',
  imports: [LoaderComponent, EmptyDataComponent, CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit{
 events: any;
 isLoading: boolean = false
  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getEvents()
  }

  getEvents(){
    this.events = []
    let params = {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxOCwicGhvbmUiOiI5NTkxNDIwMDY4IiwidXNlcl9uYW1lIjoic2FtbWVkIHAiLCJpYXQiOjE3NDgxODMwMDB9.qfhqwk6Y4ODHlG0znFIG59bOu60EEKXDFW4E3bT77mk"
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
}
