import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderUsersComponent } from './rider-users.component';

describe('RiderUsersComponent', () => {
  let component: RiderUsersComponent;
  let fixture: ComponentFixture<RiderUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiderUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
