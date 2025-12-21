import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackLoginComponent } from './track-login.component';

describe('TrackLoginComponent', () => {
  let component: TrackLoginComponent;
  let fixture: ComponentFixture<TrackLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
