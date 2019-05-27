import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-my-bar-chart',
  templateUrl: './my-bar-chart.component.html',
  styleUrls: ['./my-bar-chart.component.css']
})
export class MyBarChartComponent{
  constructor(){ 
  	var hour:number
	for (hour = 0; hour <= 24; hour++) {
		this.barChartData[0].data[hour] = hour
		this.barChartData[1].data[hour] = hour + 1
   }

  }
  public barChartOptions = {
    responsive: true
  };
  public barChartLabels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
  public barChartData = [
    { data: [0], label: 'Account A' },
    { data: [0], label: 'Account B' },
  ]
}