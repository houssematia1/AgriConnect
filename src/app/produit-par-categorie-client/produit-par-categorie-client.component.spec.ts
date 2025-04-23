import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitParCategorieClientComponent } from './produit-par-categorie-client.component';

describe('ProduitParCategorieClientComponent', () => {
  let component: ProduitParCategorieClientComponent;
  let fixture: ComponentFixture<ProduitParCategorieClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProduitParCategorieClientComponent]
    });
    fixture = TestBed.createComponent(ProduitParCategorieClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
