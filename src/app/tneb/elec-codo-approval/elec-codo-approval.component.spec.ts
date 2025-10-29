import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElecCodoApprovalComponent } from './elec-codo-approval.component';

describe('ElecCodoApprovalComponent', () => {
  let component: ElecCodoApprovalComponent;
  let fixture: ComponentFixture<ElecCodoApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElecCodoApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElecCodoApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
