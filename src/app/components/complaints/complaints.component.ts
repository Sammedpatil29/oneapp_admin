import { Component } from '@angular/core';
import { EmptyDataComponent } from "../empty-data/empty-data.component";

@Component({
  selector: 'app-complaints',
  imports: [EmptyDataComponent],
  templateUrl: './complaints.component.html',
  styleUrl: './complaints.component.css'
})
export class ComplaintsComponent {
  complaints = []
}
