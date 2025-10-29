import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEcfComponent } from './create-ecf.component';

describe('CreateEcfComponent', () => {
  let component: CreateEcfComponent;
  let fixture: ComponentFixture<CreateEcfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEcfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEcfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
