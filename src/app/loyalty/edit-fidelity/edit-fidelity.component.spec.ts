import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFidelityComponent } from './edit-fidelity.component';

describe('EditFidelityComponent', () => {
  let component: EditFidelityComponent;
  let fixture: ComponentFixture<EditFidelityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditFidelityComponent]
    });
    fixture = TestBed.createComponent(EditFidelityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
