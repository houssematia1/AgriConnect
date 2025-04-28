import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvenementService } from 'src/app/services/evenement.service';
import { CategorieService } from 'src/app/services/categorie.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-evenement-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class EvenementFormComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  isEdit = false;
  id!: number;
  categories: any[] = [];
  map!: L.Map;
  marker!: L.Marker;
  uploadedImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private evenementService: EvenementService,
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      lieu: ['', Validators.required],
      capaciteMax: ['', [Validators.required, Validators.min(1)]],
      organisateur: ['', Validators.required],
      imageUrl: [''], // ✅ ajouté ici
      categories: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.categorieService.getAll().subscribe(data => {
      this.categories = data;
    });

    this.id = +this.route.snapshot.params['id'];
    if (this.id) {
      this.isEdit = true;
      this.evenementService.getById(this.id).subscribe(data => {
        this.form.patchValue({
          ...data,
          categories: data.categories?.map((c: any) => c.id) || []
        });
        this.uploadedImageUrl = data.imageUrl; // ✅ pour afficher l’image existante
      });
    }
  }

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
      const coords = latlng.lat.toFixed(5) + ',' + latlng.lng.toFixed(5);
      this.form.patchValue({ lieu: coords });

      if (this.marker) {
        this.marker.setLatLng(latlng);
      } else {
        this.marker = L.marker(latlng).addTo(this.map);
      }
    });

    if (this.isEdit && this.form.value.lieu?.includes(',')) {
      const [lat, lng] = this.form.value.lieu.split(',').map(Number);
      const pos = L.latLng(lat, lng);
      this.map.setView(pos, 13);
      this.marker = L.marker(pos).addTo(this.map);
    }
  }

  calculateStatut(): string {
    const debut = new Date(this.form.value.dateDebut);
    const fin = new Date(this.form.value.dateFin);
    const now = new Date();

    if (now < debut) return 'PLANIFIE';
    if (now >= debut && now <= fin) return 'EN_COURS';
    if (now > fin) return 'TERMINE';
    return 'PLANIFIE';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.form.value,
      statut: this.calculateStatut(),
      categories: this.form.value.categories.map((id: number) => ({ id }))
    };

    console.log('Formulaire envoyé :', formData); // ✅ vérifie que imageUrl est bien là

    if (this.isEdit) {
      this.evenementService.update(this.id, formData).subscribe(() => {
        this.router.navigate(['/evenements']);
      });
    } else {
      this.evenementService.create(formData).subscribe(() => {
        this.router.navigate(['/evenements']);
      });
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.evenementService.uploadImage(formData).subscribe({
      next: (url: string) => {
        this.uploadedImageUrl = url;
        this.form.patchValue({ imageUrl: url });
      },
      error: (err) => console.error('Erreur lors de l\'upload d\'image', err)
    });
  }
}
