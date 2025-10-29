import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityDetailsCoDoMakerComponent } from './electricity-details-co-do-maker.component';

describe('ElectricityDetailsCoDoMakerComponent', () => {
  let component: ElectricityDetailsCoDoMakerComponent;
  let fixture: ComponentFixture<ElectricityDetailsCoDoMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricityDetailsCoDoMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityDetailsCoDoMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
