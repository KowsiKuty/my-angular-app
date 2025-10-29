import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimmodificationComponent } from './claimmodification.component';

describe('ClaimmodificationComponent', () => {
  let component: ClaimmodificationComponent;
  let fixture: ComponentFixture<ClaimmodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
