import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriqueComponent } from './historique.component';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('HistoriqueComponent', () => {
  let component: HistoriqueComponent;
  let fixture: ComponentFixture<HistoriqueComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      paramMap: of(convertToParamMap({ id: '1' })), // Fixed paramMap using convertToParamMap
    };

    await TestBed.configureTestingModule({
      declarations: [HistoriqueComponent],
      imports: [BrowserAnimationsModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriqueComponent);
    component = fixture.componentInstance;
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({
        id: 1,
        prenom: 'John',
        nom: 'Doe',
        email: 'john.doe@example.com',
        role: 'driver',
      })
    );
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user from localStorage and initialize userId', () => {
    expect(component.userId).toBe(1);
    expect(component.user.prenom).toBe('John');
    expect(component.user.nom).toBe('Doe');
  });

  it('should load history and initialize filteredHistory', () => {
    expect(component.history.length).toBeGreaterThan(0);
    expect(component.filteredHistory.length).toEqual(component.history.length);
  });

  it('should filter history based on search term', (done) => {
    component.searchTerm = '12345';
    component.onSearchChange('12345');
    setTimeout(() => {
      expect(component.filteredHistory.length).toBe(1);
      expect(component.filteredHistory[0].id).toBe('#12345');
      done();
    }, 400);
  });

  it('should filter history based on status', () => {
    component.filters.status = 'delivered';
    component.applyFilters();
    expect(component.filteredHistory.every(entry => entry.status === 'delivered')).toBeTrue();
    expect(component.activeFilters.some(filter => filter.value.includes('delivered'))).toBeTrue();
  });

  it('should filter history based on type', () => {
    component.filters.type = 'express';
    component.applyFilters();
    expect(component.filteredHistory.every(entry => entry.type === 'express')).toBeTrue();
    expect(component.activeFilters.some(filter => filter.value.includes('express'))).toBeTrue();
  });

  it('should filter history based on date range', () => {
    component.filters.startDate = '2025-04-11';
    component.filters.endDate = '2025-04-12';
    component.applyFilters();
    expect(component.filteredHistory.length).toBeGreaterThan(0);
    expect(
      component.filteredHistory.every(
        entry =>
          new Date(entry.date) >= new Date('2025-04-11') &&
          new Date(entry.date) <= new Date('2025-04-12')
      )
    ).toBeTrue();
  });

  it('should remove a filter and update active filters', () => {
    component.filters.status = 'delivered';
    component.applyFilters();
    component.removeFilter('status');
    expect(component.filters.status).toBe('');
    expect(component.activeFilters.some(filter => filter.value.includes('delivered'))).toBeFalse();
    expect(component.filteredHistory.length).toEqual(component.history.length);
  });

  it('should reset all filters', () => {
    component.filters.status = 'delivered';
    component.filters.type = 'express';
    component.searchTerm = '12345';
    component.applyFilters();
    component.resetFilters();
    expect(component.filters.status).toBe('');
    expect(component.filters.type).toBe('');
    expect(component.searchTerm).toBe('');
    expect(component.activeFilters.length).toBe(0);
    expect(component.filteredHistory.length).toEqual(component.history.length);
  });

  it('should navigate back to profile', () => {
    component.goBack();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile', 1]);
  });

  it('should display no results message when filteredHistory is empty', () => {
    component.filters.status = 'nonexistent';
    component.applyFilters();
    fixture.detectChanges();
    const noResults = fixture.debugElement.query(By.css('.no-results'));
    expect(noResults).toBeTruthy();
    expect(noResults.nativeElement.textContent).toContain('No results found');
  });

  it('should redirect to login if user is invalid', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({ id: 2, prenom: 'Jane', nom: 'Doe' })
    );
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
