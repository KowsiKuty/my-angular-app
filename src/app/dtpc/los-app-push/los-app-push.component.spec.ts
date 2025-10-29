import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosAppPushComponent } from './los-app-push.component';

describe('LosAppPushComponent', () => {
  let component: LosAppPushComponent;
  let fixture: ComponentFixture<LosAppPushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosAppPushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosAppPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
