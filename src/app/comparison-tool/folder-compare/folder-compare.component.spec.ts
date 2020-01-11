import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderCompareComponent } from './folder-compare.component';

describe('FolderCompareComponent', () => {
  let component: FolderCompareComponent;
  let fixture: ComponentFixture<FolderCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
