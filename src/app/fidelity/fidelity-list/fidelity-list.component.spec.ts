import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FidelityListComponent } from './fidelity-list.component';

describe('FidelityListComponent', () => {
  let component: FidelityListComponent;
  let fixture: ComponentFixture<FidelityListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FidelityListComponent]
    });
    fixture = TestBed.createComponent(FidelityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
