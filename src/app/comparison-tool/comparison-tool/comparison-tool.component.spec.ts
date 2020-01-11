import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonToolComponent } from './comparison-tool.component';

describe('ComparisonToolComponent', () => {
  let component: ComparisonToolComponent;
  let fixture: ComponentFixture<ComparisonToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparisonToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisonToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
