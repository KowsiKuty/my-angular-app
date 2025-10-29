import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemsMasterComponent } from './rems-master.component';

describe('RemsMasterComponent', () => {
  let component: RemsMasterComponent;
  let fixture: ComponentFixture<RemsMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
