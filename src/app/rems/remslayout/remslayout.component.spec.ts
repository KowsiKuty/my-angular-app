import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemslayoutComponent } from './remslayout.component';

describe('RemslayoutComponent', () => {
  let component: RemslayoutComponent;
  let fixture: ComponentFixture<RemslayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemslayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemslayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
