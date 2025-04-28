import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementListComponent } from './list.component';

describe('ListComponent', () => {
  let component: EvenementListComponent;
  let fixture: ComponentFixture<EvenementListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvenementListComponent]
    });
    fixture = TestBed.createComponent(EvenementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
