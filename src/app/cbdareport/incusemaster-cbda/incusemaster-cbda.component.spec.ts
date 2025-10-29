import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncusemasterCbdaComponent } from './incusemaster-cbda.component';

describe('IncusemasterCbdaComponent', () => {
  let component: IncusemasterCbdaComponent;
  let fixture: ComponentFixture<IncusemasterCbdaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncusemasterCbdaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncusemasterCbdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
