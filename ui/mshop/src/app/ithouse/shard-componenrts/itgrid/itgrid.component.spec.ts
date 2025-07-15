import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItgridComponent } from './itgrid.component';

describe('ItgridComponent', () => {
  let component: ItgridComponent;
  let fixture: ComponentFixture<ItgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItgridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
