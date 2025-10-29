import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElecViewDetailsComponent } from './elec-view-details.component';

describe('ElecViewDetailsComponent', () => {
  let component: ElecViewDetailsComponent;
  let fixture: ComponentFixture<ElecViewDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElecViewDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElecViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
