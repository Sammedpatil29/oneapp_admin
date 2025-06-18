import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
  currentUrl = ''
  constructor(private commonService: CommonService, public router: Router){ }


  ngOnInit(): void {
      this.getServices()
      this.currentUrl = this.router.url
      console.log(this.currentUrl)
  }

  // changeRoute(){
  //   this.currentUrl = this.router.url
  // }

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
