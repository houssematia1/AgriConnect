import { Component, OnInit } from '@angular/core';
import { CategorieService } from 'src/app/services/categorie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorie-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class CategorieListComponent implements OnInit {
  categories: any[] = [];

  constructor(
    private categorieService: CategorieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categorieService.getAll().subscribe(data => {
      this.categories = data;
    });
  }

  deleteCategorie(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      this.categorieService.delete(id).subscribe(() => {
        this.loadCategories(); // Refresh list après suppression
      });
    }
  }

  editCategorie(id: number) {
    this.router.navigate(['/categories/edit', id]);
  }
}
