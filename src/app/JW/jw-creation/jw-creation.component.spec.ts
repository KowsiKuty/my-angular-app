import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwCreationComponent } from './jw-creation.component';

describe('JwCreationComponent', () => {
  let component: JwCreationComponent;
  let fixture: ComponentFixture<JwCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
