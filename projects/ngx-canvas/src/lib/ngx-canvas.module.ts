import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxCanvasComponent } from './ngx-canvas.component';

@NgModule({
  declarations: [NgxCanvasComponent],
  imports: [CommonModule],
  exports: [NgxCanvasComponent]
})
export class NgxCanvasModule {
  static forRoot(): ModuleWithProviders<NgxCanvasModule> {
    return {
        ngModule: NgxCanvasModule
    };
  }
}
