import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountrulemappingComponent } from './accountrulemapping.component';

describe('AccountrulemappingComponent', () => {
  let component: AccountrulemappingComponent;
  let fixture: ComponentFixture<AccountrulemappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountrulemappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountrulemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
