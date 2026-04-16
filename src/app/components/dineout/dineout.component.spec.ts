import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DineoutComponent } from './dineout.component';

describe('DineoutComponent', () => {
  let component: DineoutComponent;
  let fixture: ComponentFixture<DineoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DineoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DineoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
