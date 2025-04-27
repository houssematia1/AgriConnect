import { TestBed } from '@angular/core/testing';

import { PromotionServiceClientService } from './promotion-service-client.service';

describe('PromotionServiceClientService', () => {
  let service: PromotionServiceClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromotionServiceClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
