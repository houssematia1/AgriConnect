import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionMenuComponent } from './promotion-menu.component';

describe('PromotionMenuComponent', () => {
  let component: PromotionMenuComponent;
  let fixture: ComponentFixture<PromotionMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionMenuComponent]
    });
    fixture = TestBed.createComponent(PromotionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
