import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityregionmasterComponent } from './electricityregionmaster.component';

describe('ElectricityregionmasterComponent', () => {
  let component: ElectricityregionmasterComponent;
  let fixture: ComponentFixture<ElectricityregionmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricityregionmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityregionmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
