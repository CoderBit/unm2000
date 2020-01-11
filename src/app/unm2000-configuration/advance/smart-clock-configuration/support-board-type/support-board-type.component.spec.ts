import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportBoardTypeComponent } from './support-board-type.component';

describe('SupportBoardTypeComponent', () => {
  let component: SupportBoardTypeComponent;
  let fixture: ComponentFixture<SupportBoardTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportBoardTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportBoardTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
