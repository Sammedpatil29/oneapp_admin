import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryCategoriesComponent } from './grocery-categories.component';

describe('GroceryCategoriesComponent', () => {
  let component: GroceryCategoriesComponent;
  let fixture: ComponentFixture<GroceryCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroceryCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
