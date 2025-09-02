import { Component, inject, OnInit } from '@angular/core';
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";
import { ComplaintsComponent } from '../complaints/complaints.component';
import { MatDialog } from '@angular/material/dialog';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';

@Component({
  selector: 'app-suggestions',
  imports: [EmptyDataComponent, CommonModule, LoaderComponent, ComplaintsComponent],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css'
})
export class SuggestionsComponent implements OnInit{
readonly dialog = inject(MatDialog);
suggestions:any;
isLoading: boolean = false
view = 'complaints'
header = ''
token: any = ''
searchTerm: any = ''

constructor(private commonService: CommonService){}

ngOnInit(): void {
  this.token = sessionStorage.getItem('token')
  this.header = 'Support Tickets🎟️'
    this.getSuggestions()
}

getSuggestions(){
  let params = {
 "token": this.token
}
this.isLoading = true
this.suggestions = []
  this.commonService.getSuggestions(params).subscribe((res:any)=>{
    this.suggestions = res.reverse()
    this.isLoading = false
    console.log(this.suggestions)
  }, error => {
    this.isLoading = false
  })
  
}

changeView(view:any){
  this.view = view
  if(view == 'suggestions'){
    this.header = 'Suggestions'
    this.getSuggestions()
  } else {
    this.header = 'Support Tickets🎟️'
  }
}

addNewTicket(){
  const dialogRef = this.dialog.open(TicketDialogComponent, {
        data: { type: 'add' },
        maxWidth: '75vw',
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result == undefined || result == 'true') {
          // this.getAllGroceryList();
        }
        console.log(`Dialog result: ${result}`);
      });
}



}
