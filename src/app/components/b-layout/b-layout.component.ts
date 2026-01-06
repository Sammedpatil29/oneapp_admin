import { Component } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-b-layout',
  imports: [RouterOutlet],
  templateUrl: './b-layout.component.html',
  styleUrl: './b-layout.component.css'
})
export class BLayoutComponent {

  constructor(private router: Router){}
navigate(target: string) {
    // console.log('Navigating to:', target);
    // Add your Router logic here: this.router.navigate([target]);
    this.router.navigate([`b-layout/${target}`])
  }
}
