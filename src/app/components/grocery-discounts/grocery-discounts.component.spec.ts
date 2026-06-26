import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryDiscountsComponent } from './grocery-discounts.component';

describe('GroceryDiscountsComponent', () => {
  let component: GroceryDiscountsComponent;
  let fixture: ComponentFixture<GroceryDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryDiscountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroceryDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
