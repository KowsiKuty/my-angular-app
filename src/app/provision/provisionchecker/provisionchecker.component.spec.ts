import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisioncheckerComponent } from './provisionchecker.component';

describe('ProvisioncheckerComponent', () => {
  let component: ProvisioncheckerComponent;
  let fixture: ComponentFixture<ProvisioncheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisioncheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisioncheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
