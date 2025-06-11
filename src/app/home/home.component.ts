import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from "../components/loader/loader.component";
import { GoogleChartsModule, ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-home',
  imports: [LoaderComponent, GoogleChartsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
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
      ['Not Available', 1],
      ['Available', this.available]
    ],
    // columnNames: ['Task', 'Hours per Day'],
    options: {
      legend: { position: 'right' },
      backgroundColor: 'transparent',
      width: '100%',
      is3D: false,
      pieHole: 0.3,
      colors: ['red', 'green']
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
    type: ChartType.LineChart,
    data: [
      ['May 1', 10, 2000],
      ['May 2', 32, 4000],
      ['May 3', 43, 566],
      ['May 4', 2, 2344],
      ['May 5', 4, 9087],
      ['May 6', 56, 2345],
      ['May 7', 44, 6756],
      ['May 8', 89, 1234],
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
}
