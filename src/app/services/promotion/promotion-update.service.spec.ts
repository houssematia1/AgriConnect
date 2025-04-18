import { TestBed } from '@angular/core/testing';

import { PromotionUpdateService } from './promotion-update.service';

describe('PromotionUpdateService', () => {
  let service: PromotionUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromotionUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
