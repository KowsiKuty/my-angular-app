import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllleadComponent } from './alllead.component';

describe('AllleadComponent', () => {
  let component: AllleadComponent;
  let fixture: ComponentFixture<AllleadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllleadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
