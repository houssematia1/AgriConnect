import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FidelityDetailsComponent } from './fidelity-details.component';

describe('FidelityDetailsComponent', () => {
  let component: FidelityDetailsComponent;
  let fixture: ComponentFixture<FidelityDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FidelityDetailsComponent]
    });
    fixture = TestBed.createComponent(FidelityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
