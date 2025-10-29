import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProvisionsummaryComponent } from './provisionsummary.component';

describe('ProvisionsummaryComponent', () => {
  let component: ProvisionsummaryComponent;
  let fixture: ComponentFixture<ProvisionsummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionsummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
