import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskPintuComponent } from './ask-pintu.component';

describe('AskPintuComponent', () => {
  let component: AskPintuComponent;
  let fixture: ComponentFixture<AskPintuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskPintuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskPintuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
