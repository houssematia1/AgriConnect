import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitParCategorieComponent } from './produit-par-categorie.component';

describe('ProduitParCategorieComponent', () => {
  let component: ProduitParCategorieComponent;
  let fixture: ComponentFixture<ProduitParCategorieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProduitParCategorieComponent]
    });
    fixture = TestBed.createComponent(ProduitParCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
