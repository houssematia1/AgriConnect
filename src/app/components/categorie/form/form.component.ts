import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategorieService } from 'src/app/services/categorie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-categorie',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormCategorieComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categorieService: CategorieService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nom: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.categorieService.create(this.form.value).subscribe(() => {
        this.router.navigate(['/categories']);
      });
    }
  }
}
