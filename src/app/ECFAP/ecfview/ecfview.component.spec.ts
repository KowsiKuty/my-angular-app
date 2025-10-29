import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfviewComponent } from './ecfview.component';

describe('EcfviewComponent', () => {
  let component: EcfviewComponent;
  let fixture: ComponentFixture<EcfviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
