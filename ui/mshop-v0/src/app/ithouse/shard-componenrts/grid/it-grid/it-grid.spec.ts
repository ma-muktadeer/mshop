import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItGrid } from './it-grid';

describe('ItGrid', () => {
  let component: ItGrid;
  let fixture: ComponentFixture<ItGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
