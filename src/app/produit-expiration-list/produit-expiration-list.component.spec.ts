import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitExpirationListComponent } from './produit-expiration-list.component';

describe('ProduitExpirationListComponent', () => {
  let component: ProduitExpirationListComponent;
  let fixture: ComponentFixture<ProduitExpirationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProduitExpirationListComponent]
    });
    fixture = TestBed.createComponent(ProduitExpirationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
