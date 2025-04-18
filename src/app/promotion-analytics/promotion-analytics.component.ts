import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChartConfiguration, ChartData } from 'chart.js';
import { finalize } from 'rxjs/operators';
import { PromotionUpdateService } from '../services/promotion/promotion-update.service';

interface PromotionStats {
  totalPromotions: number;
  activePromotions: number;
  expiredPromotions: number;
  totalPromotionsApplied: number;
}

@Component({
  selector: 'app-promotion-analytics',
  templateUrl: './promotion-analytics.component.html',
  styleUrls: ['./promotion-analytics.component.css']
})
export class PromotionAnalyticsComponent implements OnInit {
  barChartData: ChartData<'bar'> = {
    labels: ['Total', 'Actives', 'Expirées'],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Nombre de promotions',
        backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
        borderColor: ['#2563eb', '#059669', '#dc2626'],
        borderWidth: 1
      }
    ]
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    },
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`
        }
      }
    }
  };

  totalPromotions: number = 0;
  activePromotions: number = 0;
  expiredPromotions: number = 0;
  totalPromotionsApplied: number = 0;
  isLoading = false;
  errorMessage: string | null = null;
  isChartDataEmpty: boolean = true; // New property to track if chart data is all zeros

  private apiUrl = 'http://localhost:8082/promotions';

  constructor(
    private http: HttpClient,
    private promotionUpdateService: PromotionUpdateService
  ) {}

  ngOnInit(): void {
    this.loadAnalytics();
    this.setupUpdateListener(); 
  }
  private setupUpdateListener(): void {
    this.promotionUpdateService.updates$.subscribe(() => {
      this.loadAnalytics();
    });
  }
  loadAnalytics(): void {
    this.isLoading = true;
    const statsEndpoint = `${this.apiUrl}/analytics`;
    console.log('Fetching analytics from:', statsEndpoint);
    this.http.get<PromotionStats>(statsEndpoint).pipe(
      finalize(() => {
        this.isLoading = false;
        console.log('Request completed, isLoading:', this.isLoading);
      })
    ).subscribe({
      next: (stats) => this.handleSuccess(stats),
      error: (error) => this.handleError(error)
    });
  }

  private handleSuccess(stats: PromotionStats): void {
    console.log('Received analytics data (stringified):', JSON.stringify(stats, null, 2));
    console.log('Parsed values - totalPromotions:', stats.totalPromotions, 'activePromotions:', stats.activePromotions, 'expiredPromotions:', stats.expiredPromotions, 'totalPromotionsApplied:', stats.totalPromotionsApplied);

    // Update individual properties for the statistics cards
    this.totalPromotions = stats.totalPromotions || 0;
    this.activePromotions = stats.activePromotions || 0;
    this.expiredPromotions = stats.expiredPromotions || 0;
    this.totalPromotionsApplied = stats.totalPromotionsApplied || 0;

    // Update chart data
    this.barChartData = {
      ...this.barChartData,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: [
          this.totalPromotions,
          this.activePromotions,
          this.expiredPromotions
        ]
      }]
    };
    console.log('Updated barChartData:', this.barChartData.datasets[0].data);

    // Check if all chart data values are 0
    this.isChartDataEmpty = this.barChartData.datasets[0].data.every(value => value === 0);

    if (stats.totalPromotions === 0) {
      this.errorMessage = 'Aucune donnée disponible';
      this.clearMessages();
    }
  }

  private handleError(error: HttpErrorResponse): void {
    console.error('Error:', error);
    this.errorMessage = error.status === 204 
      ? 'Aucune donnée trouvée' 
      : `Erreur ${error.status}: ${error.message}`;
    this.clearMessages();
  }

  private clearMessages(): void {
    setTimeout(() => this.errorMessage = null, 5000);
  }
}