import {Component, OnChanges, SimpleChanges, Input, ViewChild} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

function div(x, y) {
  return ~~(x / y) // integer division
}

function rev(x) {
  return x - Math.floor(x / 360) * 360
}

function toDegrees(x) {
  return 180 * x / Math.PI
}

function toTime(degrees) {
 let hours = Math.floor(degrees / 15)
 let minutes = (degrees / 15 - hours) * 60
 return hours + ":" + Math.floor(minutes)
}

function sin(x) {
  return Math.sin(Math.PI * x / 180)
}

function cos(x) {
  return Math.cos(Math.PI * x / 180)
}

function tan(x) {
  return Math.tan(Math.PI * x / 180)
}

function asin(x) {
  return toDegrees(Math.asin(x))
}

function atan(x) {
  return toDegrees(Math.atan(x))
}

function atan2(x, y) {
  return toDegrees(Math.atan2(x, y))
}

class Earth {
  obliquity(dayNumber) {
    return 23.4393 - 3.563e-7 * dayNumber
  }

  gclat(latitude) {
    return latitude - 0.1924 * sin(2 * latitude)
  }

  rho(latitude) {
    return 0.99833 + 0.00167 * cos(2 * latitude)
  }
}

class Sun {
  longitudeOfPerihelion(dayNumber) {
    return 282.9404 + 4.70935e-5 * dayNumber
  }
  
  eccentricity(dayNumber) {
    return 0.016709 - 1.151e-9 * dayNumber
  }
  
  meanAnomaly(dayNumber) {
    return rev(356.0470 + 0.9856002585 * dayNumber)
  }

  meanLongitude(dayNumber) {
    return rev(this.longitudeOfPerihelion(dayNumber) + this.meanAnomaly(dayNumber))
  }

  eccentricAnomaly(dayNumber) {
    let M = this.meanAnomaly(dayNumber)
    let e = this.eccentricity(dayNumber)
    let E0 = M + (180 / Math.PI) * e * sin(M) * (1 + e * cos(M))
    return E0 // Schlyter
    // return E0 - (E0 - 180 * e * sin(E0) / Math.PI - M) / (1 - e * cos(E0))  // Taylor
  }
  
  x(dayNumber) {
    return cos(this.eccentricAnomaly(dayNumber)) - this.eccentricity(dayNumber)
  }

  y(dayNumber) {
    let e = this.eccentricity(dayNumber)
    return sin(this.eccentricAnomaly(dayNumber)) * Math.sqrt(1 - e * e)
  }

  distance(dayNumber) {
    let x = this.x(dayNumber)
    let y = this.y(dayNumber)
    return Math.sqrt(x * x + y * y)
  }

  trueAnomaly(dayNumber) {
   let x = this.x(dayNumber)
   let y = this.y(dayNumber)
   return atan2(y, x)
  }

  longitude = function(dayNumber) {
    return rev(this.trueAnomaly(dayNumber) + this.longitudeOfPerihelion(dayNumber))
  }

  xEcliptic(dayNumber) {
    return this.distance(dayNumber) * cos(this.longitude(dayNumber))
  }

  yEcliptic(dayNumber) {
    return this.distance(dayNumber) * sin(this.longitude(dayNumber))
  }

  xEquatorial(dayNumber) {
    return this.xEcliptic(dayNumber)
  }

  yEquatorial(dayNumber, earth) {
    return this.yEcliptic(dayNumber) * cos(earth.obliquity(dayNumber))
  }

  zEquatorial(dayNumber, earth) {
    return this.yEcliptic(dayNumber) * sin(earth.obliquity(dayNumber))
  }

  rightAscension(dayNumber, earth) {
    return rev(atan2(this.yEquatorial(dayNumber, earth), this.xEquatorial(dayNumber)))
  }
  
  declination(dayNumber, earth) {
    let x = this.xEquatorial(dayNumber)
    let y = this.yEquatorial(dayNumber, earth)
    return atan2(this.zEquatorial(dayNumber, earth), Math.sqrt((x * x + y * y)))
  }

  GMST0(dayNumber) {
    return this.meanLongitude(dayNumber) / 15 + 12
  }
  
  localSiderealTime(dayNumber, longitude) {
    let UT = (dayNumber % 1) * 24
    return this.GMST0(dayNumber) + UT + longitude / 15
  }
  
  hourAngle(dayNumber, longitude, earth) {
    return rev(this.localSiderealTime(dayNumber, longitude) * 15 - this.rightAscension(dayNumber, earth))
  }
  
  x2(dayNumber, longitude, earth) {
    return cos(this.hourAngle(dayNumber, longitude, earth)) * cos(this.declination(dayNumber, earth))
  }

  y2(dayNumber, longitude, earth) {
    return sin(this.hourAngle(dayNumber, longitude, earth)) * cos(this.declination(dayNumber, earth))
  }

  z2(dayNumber, longitude, earth) {
    return sin(this.declination(dayNumber, earth))
  }

  xHorizontal(dayNumber, longitude, latitude, earth) {
    return this.x2(dayNumber, longitude, earth) * sin(latitude) - this.z2(dayNumber, longitude, earth) * cos(latitude)
  }

  yHorizontal(dayNumber, longitude, latitude, earth) {
    return this.y2(dayNumber, longitude, earth)
  }

  zHorizontal(dayNumber, longitude, latitude, earth) {
    return this.x2(dayNumber, longitude, earth) * cos(latitude) + this.z2(dayNumber, longitude, earth) * sin(latitude)
  }

  azimuth(dayNumber, longitude, latitude, earth) {
    return rev(atan2(this.yHorizontal(dayNumber, longitude, latitude, earth), this.xHorizontal(dayNumber, longitude, latitude, earth)) + 180.0)
  }

  elevation(dayNumber, longitude, latitude, earth) {
    return asin(this.zHorizontal(dayNumber, longitude, latitude, earth))
  }
}

class Moon {
  longitudeOfAscendingNode(dayNumber) {
    return 125.1228 - 0.0529538083 * dayNumber
  }

  inclination = 5.1454
  
  argumentOfPerigee(dayNumber) {
    return 318.0634 + 0.1643573223 * dayNumber
  }

  meanDistance = 60.2666
  eccentricity = 0.054900

  meanAnomaly(dayNumber) {
    return rev(115.3654 + 13.0649929509 * dayNumber)
  }

  E0(dayNumber) {
    let M = this.meanAnomaly(dayNumber)
    let e = this.eccentricity
    return M + (180 / Math.PI) * e * sin(M) * (1 + e * cos(M))
  }
  
  E1(dayNumber, E0) {
    let M = this.meanAnomaly(dayNumber)
    let e = this.eccentricity
    return E0 - (E0 - (180.0 / Math.PI) * e * sin(E0) - M) / (1 - e * cos(E0))
  }

  E(dayNumber) {
    let E = this.E0(dayNumber)
    E = this.E1(dayNumber, E)
    E = this.E1(dayNumber, E)
    return E
  }

  x(dayNumber) {
    return this.meanDistance * (cos(this.E(dayNumber)) - this.eccentricity)
  }
  
  y(dayNumber) {
    let e = this.eccentricity;
    return this.meanDistance * Math.sqrt(1 - e * e) * sin(this.E(dayNumber))
  }

  r(dayNumber) {
    let x = this.x(dayNumber)
    let y = this.y(dayNumber)
    return Math.sqrt(x * x + y * y)
  }
  
  v(dayNumber) {
    let x = this.x(dayNumber)
    let y = this.y(dayNumber)
    return rev(atan2(y, x))
  }

  xeclip(dayNumber) {
    let N = this.longitudeOfAscendingNode(dayNumber);
    let v = this.v(dayNumber);
    let w = this.argumentOfPerigee(dayNumber);
    return this.r(dayNumber) * (cos(N) * cos(v + w) - sin(N) * sin(v + w) * cos(this.inclination));
  }

  yeclip(dayNumber) {
    let N = this.longitudeOfAscendingNode(dayNumber)
    let v = this.v(dayNumber)
    let w = this.argumentOfPerigee(dayNumber)
    return this.r(dayNumber) * (sin(N) * cos(v + w) + cos(N) * sin(v + w) * cos(this.inclination))
  }
  
  zeclip(dayNumber) {
    let v = this.v(dayNumber)
    let w = this.argumentOfPerigee(dayNumber)
    return this.r(dayNumber) * sin(v + w) * sin(this.inclination)
  }

  longitudeEcl(dayNumber) {
    return rev(atan2(this.yeclip(dayNumber), this.xeclip(dayNumber)))
  }

  latitudeEcl(dayNumber) {
    let x = this.xeclip(dayNumber)
    let y = this.yeclip(dayNumber)
    return atan2(this.zeclip(dayNumber), Math.sqrt(x * x + y * y))
  }

  meanLongitude(dayNumber) {
    return this.longitudeOfAscendingNode(dayNumber) + this.argumentOfPerigee(dayNumber) + this.meanAnomaly(dayNumber)
  }

  meanElongation(dayNumber, sun) {
    return this.meanLongitude(dayNumber) - sun.meanLongitude(dayNumber)
  }

  argumentOfLatitude(dayNumber) {
    return this.meanLongitude(dayNumber) - this.longitudeOfAscendingNode(dayNumber)
  }
  
  dLongitude(dayNumber, sun) {
    let Mm = this.meanAnomaly(dayNumber)
    let D = this.meanElongation(dayNumber, sun)
    let Ms = sun.meanAnomaly(dayNumber)
    let F = this.argumentOfLatitude(dayNumber)
    return -1.274 * sin(Mm - 2*D)
      +0.658 * sin(2*D)
      -0.186 * sin(Ms)
      -0.059 * sin(2*Mm - 2*D)
      -0.057 * sin(Mm - 2*D + Ms)
      +0.053 * sin(Mm + 2*D)
      +0.046 * sin(2*D - Ms)
      +0.041 * sin(Mm - Ms)
      -0.035 * sin(D)
      -0.031 * sin(Mm + Ms)
      -0.015 * sin(2*F - 2*D)
      +0.011 * sin(Mm - 4*D)
  }

  dLatitude(dayNumber, sun) {
    let Mm = this.meanAnomaly(dayNumber)
    let D = this.meanElongation(dayNumber, sun)
    let F = this.argumentOfLatitude(dayNumber)
    return -0.173 * sin(F - 2*D)
      -0.055 * sin(Mm - F - 2*D)
      -0.046 * sin(Mm + F - 2*D)
      +0.033 * sin(F + 2*D)
      +0.017 * sin(2*Mm + F)
  }
  
  dDistance(dayNumber, sun) {
    let Mm = this.meanAnomaly(dayNumber)
    let D = this.meanElongation(dayNumber, sun)
    return -0.58 * cos(Mm - 2*D)   // TODO: difference here between Schlyter and Taylor
      -0.46 * cos(2*D)
  }

  longitude = function(dayNumber, sun) {
    return this.longitudeEcl(dayNumber) + this.dLongitude(dayNumber, sun)
  };

  latitude(dayNumber, sun) {
    return this.latitudeEcl(dayNumber) + this.dLatitude(dayNumber, sun)
  }

  distance(dayNumber, sun) {
    return this.r(dayNumber) + this.dDistance(dayNumber, sun)
  }
  
  X(dayNumber, sun) {
    return cos(this.latitude(dayNumber, sun)) * cos(this.longitude(dayNumber, sun))
  }
  
  Y(dayNumber, sun) {
    return cos(this.latitude(dayNumber, sun)) * sin(this.longitude(dayNumber, sun))
  }
  
  Z(dayNumber, sun) {
    return sin(this.latitude(dayNumber, sun))
  }
  
  xEquat(dayNumber, sun) {
    return this.X(dayNumber, sun)
  }
  
  yEquat(dayNumber, sun, earth) {
    let obliquity = earth.obliquity(dayNumber)
    return this.Y(dayNumber, sun) * cos(obliquity) - this.Z(dayNumber, sun) * sin(obliquity)
  }
  
  zEquat(dayNumber, sun, earth) {
    let obliquity = earth.obliquity(dayNumber)
    return this.Y(dayNumber, sun) * sin(obliquity) + this.Z(dayNumber, sun) * cos(obliquity)
  }
  
  rightAscension(dayNumber, sun, earth) {
   return rev(atan2(this.yEquat(dayNumber, sun, earth), this.xEquat(dayNumber, sun)))
  }

  declination(dayNumber, sun, earth) {
    let x = this.xEquat(dayNumber, sun)
    let y = this.yEquat(dayNumber, sun, earth)
    return atan2(this.zEquat(dayNumber, sun, earth), Math.sqrt(x * x + y * y))
  }
  
  mpar(dayNumber, sun) {
    return asin(1/this.distance(dayNumber, sun))
  }
  
  HA(dayNumber, longitude, sun, earth) {
    let LST = sun.localSiderealTime(dayNumber, longitude) * 15  // this belongs to sun ?
    let RA = this.rightAscension(dayNumber, sun, earth)
    return rev(LST - RA)
  }

  g(dayNumber, longitude, latitude, sun, earth) {
    let gclat = earth.gclat(latitude)
    let HA = this.HA(dayNumber, longitude, sun, earth)
    return atan(tan(gclat) / cos(HA))
  }
  
  topRA(dayNumber, longitude, latitude, sun, earth) {
    let RA = this.rightAscension(dayNumber, sun, earth)
    let mpar = this.mpar(dayNumber, sun)
    let rho = earth.rho(latitude)
    let gclat = earth.gclat(latitude)
    let HA = this.HA(dayNumber, longitude, sun, earth)
    let decl = this.declination(dayNumber, sun, earth)
    return RA - mpar * rho * cos(gclat) * sin(HA) / cos(decl)
  }

  topDecl(dayNumber, longitude, latitude, sun, earth) {
    let decl = this.declination(dayNumber, sun, earth)
    let mpar = this.mpar(dayNumber, sun)
    let rho = earth.rho(latitude)
    let gclat = earth.gclat(latitude)
    let g = this.g(dayNumber, longitude, latitude, sun, earth)
    return decl - mpar * rho * sin(gclat) * sin(g - decl) / sin(g)
  }
 
  HA2(dayNumber, longitude, latitude, sun, earth) {
   let lst = sun.localSiderealTime(dayNumber, longitude) * 15
   let ra = this.topRA(dayNumber, longitude, latitude, sun, earth)
   let ha = lst - ra
   if (ha > 180) ha = ha - 360
   if (ha < 180) ha = ha + 360
   return ha
  }

  azimuth(dayNumber, longitude, latitude, sun, earth) {
    let temp1 = sin(this.topDecl(dayNumber, longitude, latitude, sun, earth))
    let temp2 = cos(this.topDecl(dayNumber, longitude, latitude, sun, earth))
    let temp3 = sin(latitude) * temp1 + cos(latitude) * temp2 * cos(this.HA2(dayNumber, longitude, latitude, sun, earth))
    let temp4 = Math.sqrt(1 - temp3 * temp3)
    let temp5 = -sin(this.HA2(dayNumber, longitude, latitude, sun, earth)) * temp2 / temp4
    let temp6 = (temp1 - temp3 * sin(latitude)) / (temp4*cos(latitude))
    let temp7 = 0
    if (temp6 < 0) temp7 = (1 - temp6)/temp5
    if (temp6 > 0) temp7 = temp5 / (1 + temp6)
    let azimuth = 2 * atan(temp7)
    if (azimuth < 0) azimuth = azimuth + 360
    return azimuth
 }
  
  elevation(dayNumber, longitude, latitude, sun, earth) {
    let temp1 = sin(this.topDecl(dayNumber, longitude, latitude, sun, earth))
    let temp2 = cos(this.topDecl(dayNumber, longitude, latitude, sun, earth))
    let temp3 = sin(latitude) * temp1 + cos(latitude) * temp2 * cos(this.HA2(dayNumber, longitude, latitude, sun, earth))
    let temp4 = Math.sqrt(1 - temp3 * temp3)
    return atan(temp3 / temp4)
 }
}

@Component({
  selector: 'app-emp',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent implements OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective

  @Input() locator: string;	
  myLongitude: number
  myLatitude: number

  utcYear: number
  utcMonth: number
  utcDay: number
  utcHour: number
  utcMinutes: number
  dayNumber: number
  
  earth: Earth
  sun: Sun
  moon: Moon
  
  constructor(){
    let now = new Date()
    this.utcYear = now.getUTCFullYear()
    this.utcMonth = now.getUTCMonth() + 1
    this.utcDay = now.getUTCDate()
    this.utcHour = now.getUTCHours()
	this.utcMinutes = now.getUTCMinutes()
	
	this.earth = new Earth
    this.sun = new Sun
    this.moon = new Moon
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
		    var newLocator = changes[propName].currentValue.toLowerCase();
		if (newLocator.length != 6) continue
			if (newLocator[0] < 'a') continue
			if (newLocator[0] > 'r') continue
			if (newLocator[1] < 'a') continue
			if (newLocator[1] > 'r') continue
			if (newLocator[2] < '0') continue
			if (newLocator[2] > '9') continue
			if (newLocator[3] < '0') continue
			if (newLocator[3] > '9') continue
			if (newLocator[4] < 'a') continue
			if (newLocator[4] > 'x') continue
			if (newLocator[5] < 'a') continue
			if (newLocator[5] > 'x') continue
			this.locator = newLocator
			this.myLatitude = this.observerLatitude(this.locator)
			this.myLongitude = this.observerLongitude(this.locator)
			this.dayNumber = this.julianDayNumber(this.utcYear, this.utcMonth, this.utcDay, this.utcHour)

			var hour:number
			for (hour = 0; hour <= 24; hour++) {
				var dayNumber = this.julianDayNumber(this.utcYear, this.utcMonth, this.utcDay, hour)
				this.barChartData[0].data[hour] = this.sun.azimuth(dayNumber, this.myLongitude, this.myLatitude, this.earth)
				this.barChartData[1].data[hour] = this.sun.elevation(dayNumber, this.myLongitude, this.myLatitude, this.earth) 
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
  julianDayNumber(year, month, day, hour) {
    return 367 * year - div((7 * (year + (div((month + 9), 12)))), 4) + div((275 * month), 9) + day - 730530 + hour / 24.0
  }

}