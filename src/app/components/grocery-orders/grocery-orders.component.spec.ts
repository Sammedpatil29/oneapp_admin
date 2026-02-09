import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryOrdersComponent } from './grocery-orders.component';

describe('GroceryOrdersComponent', () => {
  let component: GroceryOrdersComponent;
  let fixture: ComponentFixture<GroceryOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroceryOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
