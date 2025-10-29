import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisiondelmatComponent } from './provisiondelmat.component';

describe('ProvisiondelmatComponent', () => {
  let component: ProvisiondelmatComponent;
  let fixture: ComponentFixture<ProvisiondelmatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisiondelmatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisiondelmatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
