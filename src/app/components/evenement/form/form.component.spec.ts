import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementFormComponent } from './form.component';

describe('FormComponent', () => {
  let component: EvenementFormComponent;
  let fixture: ComponentFixture<EvenementFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvenementFormComponent]
    });
    fixture = TestBed.createComponent(EvenementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
