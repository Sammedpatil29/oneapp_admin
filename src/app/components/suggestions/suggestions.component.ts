import { Component, OnInit } from '@angular/core';
import { EmptyDataComponent } from "../empty-data/empty-data.component";
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-suggestions',
  imports: [EmptyDataComponent, CommonModule, LoaderComponent],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css'
})
export class SuggestionsComponent implements OnInit{
suggestions:any;
isLoading: boolean = false

constructor(private commonService: CommonService){}

ngOnInit(): void {
    this.getSuggestions()
}

getSuggestions(){
  let params = {
 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxOCwicGhvbmUiOiI5NTkxNDIwMDY4IiwidXNlcl9uYW1lIjoiU2FtbWVkIEJpcmFkYXJwYXRpbCIsImlhdCI6MTc0ODQxNzc3Nn0.eKquCtEXSiEf5_LDKnowHiHQ3oQFPQi_rdMhwMIlSAY"
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

}
