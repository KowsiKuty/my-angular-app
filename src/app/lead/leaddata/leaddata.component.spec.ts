import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaddataComponent } from './leaddata.component';

describe('LeaddataComponent', () => {
  let component: LeaddataComponent;
  let fixture: ComponentFixture<LeaddataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaddataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaddataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
