import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewwisfinTemplateComponent } from './newwisfin-template.component';

describe('NewwisfinTemplateComponent', () => {
  let component: NewwisfinTemplateComponent;
  let fixture: ComponentFixture<NewwisfinTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewwisfinTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewwisfinTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
