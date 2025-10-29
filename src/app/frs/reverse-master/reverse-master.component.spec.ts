import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseMasterComponent } from './reverse-master.component';

describe('ReverseMasterComponent', () => {
  let component: ReverseMasterComponent;
  let fixture: ComponentFixture<ReverseMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReverseMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReverseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
