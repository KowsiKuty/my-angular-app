import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmentiesComponent } from './amenties.component';

describe('AmentiesComponent', () => {
  let component: AmentiesComponent;
  let fixture: ComponentFixture<AmentiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmentiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmentiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
