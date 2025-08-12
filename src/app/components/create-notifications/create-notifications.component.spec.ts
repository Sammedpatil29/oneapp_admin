import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNotificationsComponent } from './create-notifications.component';

describe('CreateNotificationsComponent', () => {
  let component: CreateNotificationsComponent;
  let fixture: ComponentFixture<CreateNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
