import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-my-bar-chart',
  templateUrl: './my-bar-chart.component.html',
  styleUrls: ['./my-bar-chart.component.css']
})
export class MyBarChartComponent{
  constructor() { }
  public barChartOptions = {
    responsive: true
  };
  public barChartLabels = ['January', 'February', 'Mars', 'April'];
  public barChartData = [
    { data: [330, 600, 260, 700], label: 'Account A' },
    { data: [120, 455, 100, 340], label: 'Account B' },
    { data: [45, 67, 800, 500], label: 'Account C' }
  ];
}