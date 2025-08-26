import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPagination } from './grid-pagination';

describe('GridPagination', () => {
  let component: GridPagination;
  let fixture: ComponentFixture<GridPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridPagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridPagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
