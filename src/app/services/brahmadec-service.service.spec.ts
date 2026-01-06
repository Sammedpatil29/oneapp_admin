import { TestBed } from '@angular/core/testing';

import { BrahmadecServiceService } from './brahmadec-service.service';

describe('BrahmadecServiceService', () => {
  let service: BrahmadecServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrahmadecServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
