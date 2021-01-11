import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// import NgxCanvasModule
import { NgxCanvasModule } from 'ngx-canvas';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxCanvasModule, // imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
