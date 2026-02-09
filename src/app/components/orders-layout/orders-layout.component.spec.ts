import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersLayoutComponent } from './orders-layout.component';

describe('OrdersLayoutComponent', () => {
  let component: OrdersLayoutComponent;
  let fixture: ComponentFixture<OrdersLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
