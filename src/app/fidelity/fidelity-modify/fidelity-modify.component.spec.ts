import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FidelityModifyComponent } from './fidelity-modify.component';

describe('FidelityModifyComponent', () => {
  let component: FidelityModifyComponent;
  let fixture: ComponentFixture<FidelityModifyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FidelityModifyComponent]
    });
    fixture = TestBed.createComponent(FidelityModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
