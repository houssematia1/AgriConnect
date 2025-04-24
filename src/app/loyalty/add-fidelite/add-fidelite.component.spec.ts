import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFideliteComponent } from './add-fidelite.component';

describe('AddFideliteComponent', () => {
  let component: AddFideliteComponent;
  let fixture: ComponentFixture<AddFideliteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFideliteComponent]
    });
    fixture = TestBed.createComponent(AddFideliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
