import { TestBed } from '@angular/core/testing';

import { SidebarMidService } from './sidebar-mid.service';

describe('SidebarMidService', () => {
  let service: SidebarMidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarMidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
