// src/app/produit/produit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class produitComponent implements OnInit {
  produitForm: FormGroup;
  produits: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.produitForm = this.fb.group({
      id: [null],
      nom: [''],
      prix: [0],
      devise: ['TND'],
      categorie: ['Fruits'],
      stock: [0],
      seuilMin: [0],
      dateExpiration: [''],
      fournisseur: [''],
      autoReapprovisionnement: [false],
      quantiteReapprovisionnement: [0]
    });
  }

  ngOnInit() {
    this.loadProduits();
  }

  loadProduits() {
    this.http.get<any[]>('http://localhost:8082/api/produits')
      .pipe(
        catchError(error => {
          console.error('Erreur API:', error);
          return of([]);
        })
      )
      .subscribe(data => {
        this.produits = data;
      });
  }

  onSubmit() {
    const produit = this.produitForm.value;
    const request = produit.id
      ? this.http.put(`http://localhost:8082/api/produits/${produit.id}`, produit)
      : this.http.post('http://localhost:8082/api/produits', produit);
    request.subscribe(() => {
      this.loadProduits();
      this.produitForm.reset();
    });
  }

  chargerProduit(produit: any) {
    this.produitForm.patchValue(produit);
  }

  supprimerProduit(id: number) {
    this.http.delete(`http://localhost:8082/api/produits/${id}`)
      .subscribe(() => this.loadProduits());
  }
}