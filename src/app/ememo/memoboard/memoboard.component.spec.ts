import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoboardComponent } from './memoboard.component';

describe('MemoboardComponent', () => {
  let component: MemoboardComponent;
  let fixture: ComponentFixture<MemoboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
