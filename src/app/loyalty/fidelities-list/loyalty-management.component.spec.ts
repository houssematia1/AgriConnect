import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FidelitiesListComponent } from './fidelities-list.component.';   

describe('LoyaltyManagementComponent', () => {
  let component: FidelitiesListComponent;
  let fixture: ComponentFixture<FidelitiesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FidelitiesListComponent]
    });
    fixture = TestBed.createComponent(FidelitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
