import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnockhistoryComponent } from './knockhistory.component';

describe('KnockhistoryComponent', () => {
  let component: KnockhistoryComponent;
  let fixture: ComponentFixture<KnockhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnockhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnockhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
