import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { MyBarChartComponent } from './my-bar-chart/line-chart.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { MoonComponent }  from './my-bar-chart/moon.component';
import { NgDatepickerModule } from 'ng2-datepicker';

const routes: Routes = [
  {path: 'bar-chart', component: MyBarChartComponent},
  {path: '**', component: MyBarChartComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    MyBarChartComponent,
	MoonComponent
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


