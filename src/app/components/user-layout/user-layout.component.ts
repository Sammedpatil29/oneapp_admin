import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from "@angular/router";

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css'],
  imports: [RouterOutlet]
})
export class UserLayoutComponent implements OnInit{
  isDropdownOpen: boolean = false;
  selectedOption: string = 'Admin Users'; // Default label
  
  // Example array (update according to your actual data structure)
  services: any[] = [
    { title: 'Admin Users', display: 'Admin Users'},
    { title: 'Users', display: 'Normal Users' },
    { title: 'Riders', display: 'Riders' }
  ];

  constructor(private router: Router){}

  ngOnInit(): void {
    if(this.selectedOption == 'Admin Users'){
      this.router.navigate(['/layout/manageUsers/admin-users']);
    }
  }

  selectOption(title: string): void {
    this.selectedOption = title;
    this.isDropdownOpen = false; // Automatically close after selection
    if(title === 'Admin Users') {
      this.router.navigate(['/layout/manageUsers/admin-users']);
    } else if(title === 'Riders') {
      this.router.navigate(['/layout/manageUsers/rider-users']);
    } else {
      this.router.navigate(['/layout/manageUsers/manage-users']);
    }
  }
}
