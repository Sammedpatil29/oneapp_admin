import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BQuoteComponent } from './b-quote.component';

describe('BQuoteComponent', () => {
  let component: BQuoteComponent;
  let fixture: ComponentFixture<BQuoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BQuoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
