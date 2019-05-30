import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
  selector: 'app-my-bar-chart',
  templateUrl: './my-bar-chart.component.html',
  styleUrls: ['./my-bar-chart.component.css']
})
export class MyBarChartComponent{
  locatora: string = 'kp11mk';

  constructor(){

    }
   public onChartClick(e: any): void {
	  console.log('hello')

  }
}