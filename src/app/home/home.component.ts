import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderComponent } from "../components/loader/loader.component";
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { ButtonSpinnerComponent } from "../components/button-spinner/button-spinner.component";
import { CommonModule } from '@angular/common';
import { CommonService } from '../services/common.service';
import { unsubscribe } from 'diagnostics_channel';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [LoaderComponent, GoogleChartsModule, ButtonSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy{
  isLoading: boolean = false 
  isDataLoading: boolean = false
  private apiSub!: Subscription;

  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getServiceCount()
      this.getOrdersCount()
      setTimeout(()=>{
        setInterval(()=>{
        this.loadCountOnInterval()
      }, 10000)
      },5000)
  }

  ngOnDestroy(): void {
      if(this.apiSub){
        this.apiSub.unsubscribe()
      }
  }



  available = 2
chart = {
    title: 'Orders',
     type: ChartType.PieChart,
    data: [
      ['Doctor', 8],
      ['Food', 2],
      ['Grocery', 2],
      ['Vegitables', 3],
      ['Events', 9],
    ],
    columnNames: ['Task', 'Hours per Day'],
    options: {
      legend: { position: 'right' },
      backgroundColor: 'transparent',
      width: '100%',
      is3D: false,
      pieHole: 0.3,
    }
  };

  servicesChart = {
    title: 'Services',
     type: ChartType.PieChart,
    data: [
      ['Not Available', 0],
      ['Available', 1]
    ],
    // columnNames: ['Task', 'Hours per Day'],
    options: {
      legend: { position: 'right' },
      backgroundColor: 'transparent',
      width: '100%',
      is3D: false,
      pieHole: 0.3,
    }
  };

  salesChart = {
    title: 'Sales (in Rupees)',
     type: ChartType.PieChart,
    data: [
      ['Doctor', 5000],
      ['Food', 400],
      ['Events', 0],
      ['Grocery', 6000],
      ['Vegitables', 6000],
    ],
    // columnNames: ['Task', 'Hours per Day'],
    options: {
      legend: { position: 'right' },
      backgroundColor: 'transparent',
      width: '100%',
      is3D: false,
      pieHole: 0.3,
      // colors: ['red', 'green']
    }
  };

  lineChart = {
    type: ChartType.AreaChart,
    data: [
      ['May 1', 1500, 2000],
      ['May 2', 2000, 4000],
      ['May 3', 700, 566],
      ['May 4', 2000, 2344],
      ['May 5', 5000, 9087],
      ['May 6', 1000, 2345],
      ['May 7', 3000, 6756],
      ['May 8', 600, 1234],
    ],
    columnNames: ['Day', 'Orders', 'Sales'],
    options: {
      title: 'Compare Daily Sales',
      width: '850',
      backgroundColor: 'transparent',
      explorer: {
        actions: ['dragToZoom', 'rightClickToReset'],
        axis: 'both',
        keepInBounds: true,
        maxZoomIn: 0.1,
      },
      hAxis: {
        title: 'Day',
        textStyle: {
          color: '#333',
        },
      },
      vAxis: {
        title: 'Sales',
        minValue: 0,
      },
      legend: { position: 'right' },
    }
  };

  getServiceCount(){
    this.isLoading = true
    this.commonService.servicesCount().subscribe((res:any)=> {
       this.servicesChart.data = res
        this.isLoading = false
    })
  }

  getOrdersCount(){
    this.isLoading = true
    this.commonService.ordersCount().subscribe((res:any)=> {
         this.chart.data = res[0]
        this.salesChart.data = res[0]
        this.isLoading = false
        console.log(this.servicesChart.data)
    })
  }

  loadCountOnInterval(){
    this.isDataLoading = true
    this.apiSub = this.commonService.servicesCount().subscribe((res:any)=> {
        this.servicesChart.data = res
        this.isDataLoading = false
        console.log(this.servicesChart.data)
    })
  }
}
