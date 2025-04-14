import { TestBed } from '@angular/core/testing';

import { DonService } from './don.service';

describe('DonService', () => {
  let service: DonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
