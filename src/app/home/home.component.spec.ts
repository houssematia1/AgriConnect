import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ProduitService } from '../services/produit.service';
import { CurrencyPipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let produitService: ProduitService;

  beforeEach(async () => {
    const produitServiceStub = {
      getAll: () => of([]) // Mock empty product list
    };

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule],
      providers: [
        CurrencyPipe,
        { provide: ProduitService, useValue: produitServiceStub },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustUrl: (url: string) => url } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    produitService = TestBed.inject(ProduitService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const mockProducts = [
      { id: 1, nom: 'Test Product', prix: 100, devise: 'XAF', imageUrl: 'test.jpg' }
    ];
    spyOn(produitService, 'getAll').and.returnValue(of(mockProducts));
    component.ngOnInit();
    expect(component.products.length).toBe(1);
    expect(component.products[0].name).toBe('Test Product');
  });
});