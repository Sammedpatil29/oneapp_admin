import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BLeadsComponent } from './b-leads.component';

describe('BLeadsComponent', () => {
  let component: BLeadsComponent;
  let fixture: ComponentFixture<BLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BLeadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
