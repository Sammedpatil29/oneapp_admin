import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-under-development',
  imports: [],
  templateUrl: './under-development.component.html',
  styleUrl: './under-development.component.css'
})
export class UnderDevelopmentComponent {
@Input() featureName: string = '';
@Input() message: string = '';
}
