import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BLeadDetailsComponent } from './b-lead-details.component';

describe('BLeadDetailsComponent', () => {
  let component: BLeadDetailsComponent;
  let fixture: ComponentFixture<BLeadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BLeadDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BLeadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
