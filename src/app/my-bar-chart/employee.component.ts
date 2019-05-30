import {Component, OnChanges, SimpleChanges, Input, ViewChild} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
 
@Component({
  selector: 'app-emp',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective

  @Input() locator: string;	
  newLocator: string;
  myLongitude: number
  myLatitude: number
  
  constructor(){
  }
  public barChartOptions = {
    responsive: true
  };
  public barChartLabels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
  public barChartData = [
    { data: [0], label: 'Account A' },
    { data: [0], label: 'Account B' },
  ]
  
  ngOnChanges(changes: SimpleChanges) {
	  
	for (let propName in changes) {  
		
		if (propName === 'locator') {
		    this.newLocator = changes[propName].currentValue.toLowerCase();
		if (this.newLocator.length != 6) continue
			if (this.newLocator[0] < 'a') continue
			if (this.newLocator[0] > 'r') continue
			if (this.newLocator[1] < 'a') continue
			if (this.newLocator[1] > 'r') continue
			if (this.newLocator[2] < '0') continue
			if (this.newLocator[2] > '9') continue
			if (this.newLocator[3] < '0') continue
			if (this.newLocator[3] > '9') continue
			if (this.newLocator[4] < 'a') continue
			if (this.newLocator[4] > 'x') continue
			if (this.newLocator[5] < 'a') continue
			if (this.newLocator[5] > 'x') continue
			this.locator = this.newLocator
			this.myLatitude = this.observerLatitude(this.locator)
			this.myLongitude = this.observerLongitude(this.locator)
			var hour:number
			for (hour = 0; hour <= 24; hour++) {
				this.barChartData[0].data[hour] = hour
				this.barChartData[1].data[hour] = Math.floor(Math.random() * 6) + 1  
			}
			if (this.chart && this.chart.chart){
			    this.chart.chart.update()
				console.log(this.locator )
			}
    
		}
    }
  }
    observerLongitude(locator) {
    locator = locator.toUpperCase()
    let field = 20 * (locator.charCodeAt(0) - 65) - 180
    let grid = 2 * (locator.charCodeAt(2) - 48)
    let subGrid = 5 * (locator.charCodeAt(4) - 65) / 60
    return field + grid + subGrid + 1/24
  }
  
  observerLatitude(locator) {
    locator = locator.toUpperCase()
    let field = 10 * (locator.charCodeAt(1) - 65) - 90
    let grid = locator.charCodeAt(3) - 48
    let subGrid = 2.5 * (locator.charCodeAt(5) - 65) / 60
    return field + grid + subGrid + 1/48
  }
}