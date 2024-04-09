import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { LineChartComponent } from './line-chart/line-chart.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { MoonComponent }  from './line-chart/moon.component';
import { NgDatepickerModule } from 'ng2-datepicker';
import { SalesComponent } from './sales/sales.component';

const routes: Routes = [
  {path: 'bar-chart', component: LineChartComponent},
  {path: '**', component: LineChartComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
	MoonComponent,
	SalesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	ChartsModule,
	RouterModule.forRoot(routes),
	FormsModule,
	NgDatepickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


