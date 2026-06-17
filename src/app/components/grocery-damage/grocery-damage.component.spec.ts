import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryDamageComponent } from './grocery-damage.component';

describe('GroceryDamageComponent', () => {
  let component: GroceryDamageComponent;
  let fixture: ComponentFixture<GroceryDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryDamageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroceryDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
