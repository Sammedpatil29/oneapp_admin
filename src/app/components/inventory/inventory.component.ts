import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-inventory',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LoaderComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit{
  services:any;
  isLoading: boolean = false
  constructor(private commonService: CommonService){ }


  ngOnInit(): void {
      this.getServices()
  }

  getServices(){
  this.services = []
  this.isLoading = true
    this.commonService.getServices().subscribe((res)=>{
      this.services = res
      this.isLoading = false 
    })
  }

  getStatusClass(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-success';
    case 'coming_soon':
      return 'bg-warning'; 
    case 'not_available':
      return 'bg-danger'; 
    default:
      return '';
  }
}
}
