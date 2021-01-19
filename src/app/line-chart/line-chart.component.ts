import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent{
  locatora: string = 'kp11mk'
  locatorb: string = ''

  constructor(){
  }
  public onChartClick(e: any): void {
    console.log('hello')
  }
}