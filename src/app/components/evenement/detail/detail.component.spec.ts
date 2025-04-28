import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvenementDetailComponent } from './detail.component';


describe('DetailComponent', () => {
  let component: EvenementDetailComponent;
  let fixture: ComponentFixture<EvenementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvenementDetailComponent]
    });
    fixture = TestBed.createComponent(EvenementDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
