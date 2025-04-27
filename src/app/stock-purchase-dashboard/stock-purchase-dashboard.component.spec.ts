import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPurchaseDashboardComponent } from './stock-purchase-dashboard.component';

describe('StockPurchaseDashboardComponent', () => {
  let component: StockPurchaseDashboardComponent;
  let fixture: ComponentFixture<StockPurchaseDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockPurchaseDashboardComponent]
    });
    fixture = TestBed.createComponent(StockPurchaseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
