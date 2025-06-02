import { Component } from '@angular/core';
import { EmptyDataComponent } from "../empty-data/empty-data.component";

@Component({
  selector: 'app-suggestions',
  imports: [EmptyDataComponent],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css'
})
export class SuggestionsComponent {
suggestions = []
}
