import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProvisionsmakerComponent } from './provisionsmaker.component';
describe('ProvisionsmakerComponent', () => {
  let component: ProvisionsmakerComponent;
  let fixture: ComponentFixture<ProvisionsmakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionsmakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionsmakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
