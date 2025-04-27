import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitDetailsClientComponent } from './produit-details-client.component';

describe('ProduitDetailsClientComponent', () => {
  let component: ProduitDetailsClientComponent;
  let fixture: ComponentFixture<ProduitDetailsClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProduitDetailsClientComponent]
    });
    fixture = TestBed.createComponent(ProduitDetailsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
