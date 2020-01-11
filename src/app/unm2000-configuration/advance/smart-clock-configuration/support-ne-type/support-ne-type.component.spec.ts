import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportNeTypeComponent } from './support-ne-type.component';

describe('SupportNeTypeComponent', () => {
  let component: SupportNeTypeComponent;
  let fixture: ComponentFixture<SupportNeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportNeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportNeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
