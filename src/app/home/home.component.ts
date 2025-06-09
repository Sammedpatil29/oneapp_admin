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
chart = {
    title: 'Orders',
     type: ChartType.PieChart,
    data: [
      ['Work', 8],
      ['Eat', 2],
      ['Commute', 2],
      ['Watch TV', 3],
      ['Sleep', 9],
    ],
    columnNames: ['Task', 'Hours per Day'],
    options: {
      legend: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      is3D: false,
      pieHole: 0.3,
    }
  };

  lineChart = {
    type: ChartType.LineChart,
    data: [
      ['Jan', 100, 200],
      ['Feb', 120, 200],
      ['Mar', 180, 40],
      ['Apr', 80, 180],
      ['Apr', 80, 180],
      ['Apr', 80, 180],
      ['Apr', 80, 180],
      ['May', 200, 20],
    ],
    columnNames: ['Month', 'Sales'],
    options: {
      title: 'Compare Sales',
      width: '1200',
      backgroundColor: 'transparent',
      explorer: {
        actions: ['dragToZoom', 'rightClickToReset'],
        axis: 'both',
        keepInBounds: true,
        maxZoomIn: 0.1,
      },
      hAxis: {
        title: 'Month',
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
