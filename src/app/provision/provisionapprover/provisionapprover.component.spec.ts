import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionapproverComponent } from './provisionapprover.component';

describe('ProvisionapproverComponent', () => {
  let component: ProvisionapproverComponent;
  let fixture: ComponentFixture<ProvisionapproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionapproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionapproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
