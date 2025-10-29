import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaAccRepostComponent } from './fa-acc-repost.component';

describe('FaAccRepostComponent', () => {
  let component: FaAccRepostComponent;
  let fixture: ComponentFixture<FaAccRepostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaAccRepostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaAccRepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
