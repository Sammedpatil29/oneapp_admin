import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryOrderDetailsComponent } from './grocery-order-details.component';

describe('GroceryOrderDetailsComponent', () => {
  let component: GroceryOrderDetailsComponent;
  let fixture: ComponentFixture<GroceryOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryOrderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroceryOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
