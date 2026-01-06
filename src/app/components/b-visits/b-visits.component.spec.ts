import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BVisitsComponent } from './b-visits.component';

describe('BVisitsComponent', () => {
  let component: BVisitsComponent;
  let fixture: ComponentFixture<BVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BVisitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
