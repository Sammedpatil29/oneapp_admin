import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderDialogComponent } from './rider-dialog.component';

describe('RiderDialogComponent', () => {
  let component: RiderDialogComponent;
  let fixture: ComponentFixture<RiderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
