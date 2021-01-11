import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCanvasComponent } from './ngx-canvas.component';

describe('NgxCanvasComponent', () => {
  let component: NgxCanvasComponent;
  let fixture: ComponentFixture<NgxCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
