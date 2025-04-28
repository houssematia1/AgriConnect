import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nomValide(control: AbstractControl): ValidationErrors | null {
  const regex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  return control.value && !regex.test(control.value) ? { nomInvalide: true } : null;
}

export function descriptionValide(control: AbstractControl): ValidationErrors | null {
  return control.value && control.value.length < 20 ? { descriptionCourte: true } : null;
}


export function organisateurValide(control: AbstractControl): ValidationErrors | null {
  const regex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  return control.value && !regex.test(control.value) ? { organisateurInvalide: true } : null;
}

export function urlValide(control: AbstractControl): ValidationErrors | null {
  const regex = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
  return control.value && control.value.length > 0 && !regex.test(control.value)
    ? { urlInvalide: true }
    : null;
}

export function dateDebutNonDansLePasse(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const today = new Date().setHours(0, 0, 0, 0);
  const valeur = new Date(control.value).setHours(0, 0, 0, 0);
  return valeur < today ? { dateDansLePasse: true } : null;
}

export const dateDebutAvantDateFinValidator: ValidatorFn = (group: AbstractControl) => {
  const debut = group.get('dateDebut')?.value;
  const fin = group.get('dateFin')?.value;
  if (debut && fin && new Date(debut) > new Date(fin)) {
    return { dateInvalide: true };
  }
  return null;
};
