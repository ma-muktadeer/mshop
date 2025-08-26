import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridBody } from './grid-body';

describe('GridBody', () => {
  let component: GridBody;
  let fixture: ComponentFixture<GridBody>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridBody]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridBody);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
