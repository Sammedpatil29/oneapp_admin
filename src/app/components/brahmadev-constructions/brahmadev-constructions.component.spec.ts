import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrahmadevConstructionsComponent } from './brahmadev-constructions.component';

describe('BrahmadevConstructionsComponent', () => {
  let component: BrahmadevConstructionsComponent;
  let fixture: ComponentFixture<BrahmadevConstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrahmadevConstructionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrahmadevConstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
