import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionAnalyticsComponent } from './promotion-analytics.component';

describe('PromotionAnalyticsComponent', () => {
  let component: PromotionAnalyticsComponent;
  let fixture: ComponentFixture<PromotionAnalyticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionAnalyticsComponent]
    });
    fixture = TestBed.createComponent(PromotionAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
