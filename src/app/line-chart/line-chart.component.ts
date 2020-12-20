import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, ViewChild } from '@angular/core';
import { getCookie} from './cookies'

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent{
  locatora: string = getCookie("mylocator")
  locatorb: string = ''

  constructor(){
  }
  public onChartClick(e: any): void {
    console.log('hello')
  }
}