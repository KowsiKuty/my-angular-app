import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaDbmanageComponent } from './fa-dbmanage.component';

describe('FaDbmanageComponent', () => {
  let component: FaDbmanageComponent;
  let fixture: ComponentFixture<FaDbmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaDbmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaDbmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
