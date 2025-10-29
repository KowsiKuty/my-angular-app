import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrievalformComponent } from './retrievalform.component';

describe('RetrievalformComponent', () => {
  let component: RetrievalformComponent;
  let fixture: ComponentFixture<RetrievalformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrievalformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrievalformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
