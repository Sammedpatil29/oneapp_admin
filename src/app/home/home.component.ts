import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderComponent } from "../components/loader/loader.component";
import { GoogleChartsModule, ChartType } from 'angular-google-charts';
import { ButtonSpinnerComponent } from "../components/button-spinner/button-spinner.component";
import { CommonModule, isPlatformServer } from '@angular/common';
import { CommonService } from '../services/common.service';
import { unsubscribe } from 'diagnostics_channel';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { get } from 'http';



@Component({
  selector: 'app-home',
  imports: [LoaderComponent, GoogleChartsModule, ButtonSpinnerComponent, CommonModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy{
  isLoading: boolean = false 
  isDataLoading: boolean = false
  intervalId: any
  private apiSub!: Subscription;
  startDate:any = new Date();
  endDate:any = new Date();
  maxDate: Date = new Date();
  homeData: any = {}

  constructor(private commonService: CommonService){}

  ngOnInit(): void {
      this.getHomeData()
      // setTimeout(()=>{
      //   this.intervalId = setInterval(()=>{
      //   this.loadCountOnInterval()
      // }, 10000)
      // },5000)
  }

  ngOnDestroy(): void {
      if(this.apiSub){
        this.apiSub.unsubscribe()
      }
      if(this.intervalId){
         clearInterval(this.intervalId);
      }
  }



  available = 2
chart = {
    title: 'Orders',
     type: ChartType.PieChart,
      data: [],
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
    data: [],
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
    data: [],
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
    data: [],
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

  getHomeData(){
    this.isLoading = true

    // Ensure start date is at 00:00:00 and end date is at 23:59:59 (11:59:59 PM)
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setHours(23, 59, 59, 999);

    const startTimestamp = Math.floor(this.startDate.getTime() / 1000);
      const endTimestamp = Math.floor(this.endDate.getTime() / 1000);
      let params = {
        startDate: startTimestamp,
        endDate: endTimestamp
      }
    this.commonService.homedata(params).subscribe((res:any)=> {
       this.homeData = res.data;
       this.servicesChart.data = this.homeData.serviceStatusData || [];
       this.chart.data = this.homeData.orderCountData || [];
       this.salesChart.data = this.homeData.salesValueData || [];
       this.lineChart.data = this.homeData.trendData || [];
       this.isLoading = false
    }, error => {
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

  // loadCountOnInterval(){
  //   this.isDataLoading = true
  //   this.apiSub = this.commonService.servicesCount().subscribe((res:any)=> {
  //       this.servicesChart.data = res
  //       this.isDataLoading = false
  //       console.log(this.servicesChart.data)
  //   })
  // }

  onDateChange(event: any) {
    if(this.startDate && this.endDate){
      // Set endDate to 23:59:59 (11:59:59 PM)
      this.endDate.setHours(23, 59, 59, 999);

      // .getTime() returns milliseconds since epoch. Divide by 1000 for seconds (Unix/Linux time).
      const startTimestamp = Math.floor(this.startDate.getTime() / 1000);
      const endTimestamp = Math.floor(this.endDate.getTime() / 1000);

      console.log('Selected date range (Linux time):', { start: startTimestamp, end: endTimestamp });
      this.getHomeData()
      // You can now use these timestamps to filter your dashboard data.
    }
  }
}
