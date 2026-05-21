import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UnderDevelopmentComponent } from "../under-development/under-development.component";

@Component({
  selector: 'app-validation',
  imports: [CommonModule, UnderDevelopmentComponent],
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.css'
})
export class ValidationComponent {

}
