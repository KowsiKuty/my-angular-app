import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SgmsterComponent } from './sgmster.component';

describe('SgmsterComponent', () => {
  let component: SgmsterComponent;
  let fixture: ComponentFixture<SgmsterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SgmsterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgmsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
