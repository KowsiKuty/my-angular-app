import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfapComponent } from './ecfap.component';

describe('EcfapComponent', () => {
  let component: EcfapComponent;
  let fixture: ComponentFixture<EcfapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
