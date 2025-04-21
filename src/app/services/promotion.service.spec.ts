import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PromotionService, AnalyticsResponse, Promotion, AnalyticsSummary } from './promotion.service';

describe('PromotionService', () => {
  let service: PromotionService;
  let httpMock: HttpTestingController;

  // Mock data for testing
  const mockPromotions: Promotion[] = [
    { id: 1, nom: 'Black Friday', pourcentageReduction: 20, dateDebut: '2024-11-01', dateFin: '2024-11-30', conditionPromotion: 'MONTANT_MIN', active: true },
    { id: 2, nom: 'Expiration Discount', pourcentageReduction: 40, dateDebut: '2025-04-01', dateFin: '2025-04-10', conditionPromotion: 'EXPIRATION_PRODUIT', active: false }
  ];

  const mockActivePromotions: Promotion[] = [
    { id: 1, nom: 'Black Friday', pourcentageReduction: 20, dateDebut: '2024-11-01', dateFin: '2024-11-30', conditionPromotion: 'MONTANT_MIN', active: true }
  ];

  const mockAnalytics: AnalyticsResponse = {
    totalPromotionsApplied: 15,
    promotionStats: [
      { promotionId: 1, promotionName: 'Black Friday', usageCount: 5, totalRevenueImpact: 100.50 },
      { promotionId: 2, promotionName: 'Expiration Discount', usageCount: 10, totalRevenueImpact: 200.75 }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Add HttpClientTestingModule
      providers: [PromotionService]
    });

    service = TestBed.inject(PromotionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch analytics data successfully', () => {
    service.getAnalytics().subscribe((result: AnalyticsSummary) => {
      expect(result).toBeDefined();
      expect(result.totalPromotions).toBe(2); // 2 promotions
      expect(result.activePromotions).toBe(1); // 1 active promotion
      expect(result.expiredPromotions).toBe(1); // 1 expired (Expiration Discount ended 2025-04-10, today is 2025-04-19)
      expect(result.totalPromotionsApplied).toBe(15);
      expect(result.chartData.labels).toEqual(['Black Friday', 'Expiration Discount']);
      expect(result.chartData.datasets[0].data).toEqual([5, 10]);
    });

    // Mock the three HTTP requests
    const analyticsReq = httpMock.expectOne('http://localhost:8082/promotions/analytics');
    expect(analyticsReq.request.method).toBe('GET');
    analyticsReq.flush(mockAnalytics);

    const allPromotionsReq = httpMock.expectOne('http://localhost:8082/promotions');
    expect(allPromotionsReq.request.method).toBe('GET');
    allPromotionsReq.flush(mockPromotions);

    const activePromotionsReq = httpMock.expectOne('http://localhost:8082/promotions/actives');
    expect(activePromotionsReq.request.method).toBe('GET');
    activePromotionsReq.flush(mockActivePromotions);
  });

  it('should handle errors when fetching analytics data', () => {
    service.getAnalytics().subscribe((result: AnalyticsSummary) => {
      expect(result).toBeDefined();
      expect(result.totalPromotions).toBe(0);
      expect(result.activePromotions).toBe(0);
      expect(result.expiredPromotions).toBe(0);
      expect(result.totalPromotionsApplied).toBe(0);
      expect(result.chartData.labels).toEqual([]);
      expect(result.chartData.datasets).toEqual([]);
    });

    // Mock errors for all requests
    const analyticsReq = httpMock.expectOne('http://localhost:8082/promotions/analytics');
    analyticsReq.flush(null, { status: 500, statusText: 'Server Error' });

    const allPromotionsReq = httpMock.expectOne('http://localhost:8082/promotions');
    allPromotionsReq.flush(null, { status: 500, statusText: 'Server Error' });

    const activePromotionsReq = httpMock.expectOne('http://localhost:8082/promotions/actives');
    activePromotionsReq.flush(null, { status: 500, statusText: 'Server Error' });
  });

  it('should return empty chart data when promotionStats is empty', () => {
    const emptyAnalytics: AnalyticsResponse = {
      totalPromotionsApplied: 0,
      promotionStats: []
    };

    service.getAnalytics().subscribe((result: AnalyticsSummary) => {
      expect(result.chartData.labels).toEqual([]);
      expect(result.chartData.datasets).toEqual([ { label: 'Applications', data: [] } ]);
    });

    // Mock the requests
    const analyticsReq = httpMock.expectOne('http://localhost:8082/promotions/analytics');
    analyticsReq.flush(emptyAnalytics);

    const allPromotionsReq = httpMock.expectOne('http://localhost:8082/promotions');
    allPromotionsReq.flush(mockPromotions);

    const activePromotionsReq = httpMock.expectOne('http://localhost:8082/promotions/actives');
    activePromotionsReq.flush(mockActivePromotions);
  });
});