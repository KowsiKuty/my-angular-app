import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendermarkupmasterComponent } from './vendermarkupmaster.component';

describe('VendermarkupmasterComponent', () => {
  let component: VendermarkupmasterComponent;
  let fixture: ComponentFixture<VendermarkupmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendermarkupmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendermarkupmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
