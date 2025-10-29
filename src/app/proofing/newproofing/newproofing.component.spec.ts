import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewproofingComponent } from './newproofing.component';

describe('NewproofingComponent', () => {
  let component: NewproofingComponent;
  let fixture: ComponentFixture<NewproofingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewproofingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewproofingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
