import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaRawDataComponent } from './ta-raw-data.component';

describe('TaRawDataComponent', () => {
  let component: TaRawDataComponent;
  let fixture: ComponentFixture<TaRawDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaRawDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaRawDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
