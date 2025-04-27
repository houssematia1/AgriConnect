import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedProductsComponent } from './recommended-products.component';

describe('RecommendedProductsComponent', () => {
  let component: RecommendedProductsComponent;
  let fixture: ComponentFixture<RecommendedProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendedProductsComponent]
    });
    fixture = TestBed.createComponent(RecommendedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
