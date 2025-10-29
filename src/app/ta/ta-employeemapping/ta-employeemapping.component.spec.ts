import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaEmployeemappingComponent } from './ta-employeemapping.component';

describe('TaEmployeemappingComponent', () => {
  let component: TaEmployeemappingComponent;
  let fixture: ComponentFixture<TaEmployeemappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaEmployeemappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaEmployeemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
