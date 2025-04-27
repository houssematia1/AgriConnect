import { TestBed } from '@angular/core/testing';

import { StockPurchaseService } from './stock-purchase.service';

describe('StockPurchaseService', () => {
  let service: StockPurchaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockPurchaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
