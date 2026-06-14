import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundExchangeComponent } from './refund-exchange.component';

describe('RefundExchangeComponent', () => {
  let component: RefundExchangeComponent;
  let fixture: ComponentFixture<RefundExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundExchangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RefundExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
