import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { produitComponent } from './produit.component';

describe('produitComponent', () => {
  let component: produitComponent;
  let fixture: ComponentFixture<produitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [produitComponent],
      imports: [
        ReactiveFormsModule, // Ajoute ceci pour [formGroup]
        HttpClientTestingModule // Ajoute ceci pour HttpClient
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(produitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});