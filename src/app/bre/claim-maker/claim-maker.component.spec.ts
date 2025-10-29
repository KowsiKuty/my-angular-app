import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimMakerComponent } from './claim-maker.component';

describe('ClaimMakerComponent', () => {
  let component: ClaimMakerComponent;
  let fixture: ComponentFixture<ClaimMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
