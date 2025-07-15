import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGrid } from './test-grid';

describe('TestGrid', () => {
  let component: TestGrid;
  let fixture: ComponentFixture<TestGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
