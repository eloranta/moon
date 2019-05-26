import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { MyLineChartComponent } from './my-line-chart/my-line-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    MyLineChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
