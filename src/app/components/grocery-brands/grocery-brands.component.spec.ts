import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryBrandsComponent } from './grocery-brands.component';

describe('GroceryBrandsComponent', () => {
  let component: GroceryBrandsComponent;
  let fixture: ComponentFixture<GroceryBrandsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryBrandsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroceryBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
