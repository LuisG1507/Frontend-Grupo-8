import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { Reviewservice } from '../../../../services/reviewservice';
import { ReviewsReviewsRatingDistributionDTO } from '../../../../models/reports/review/reviews-reviews-rating-distribution-dto';
@Component({
  selector: 'app-review-rating-distribution',
  imports: [DecimalPipe, MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './review-rating-distribution.html',
  styleUrl: './review-rating-distribution.css',
})
export class ReviewRatingDistribution implements OnInit {
  distribucion: ReviewsReviewsRatingDistributionDTO[] = [];

  chartData: ChartData<'doughnut'> = {
    labels: ['Malas', 'Regulares', 'Buenas'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#e57373', '#ffd54f', '#81c784'],
      },
    ],
  };

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  constructor(private rS: Reviewservice) {}

  ngOnInit(): void {
    this.cargarDistribucionDeCalificaciones();
  }

  cargarDistribucionDeCalificaciones() {
    this.rS.ratingDistribution().subscribe((data) => {
      this.distribucion = data;

      const resumen = this.distribucion[0];
      if (resumen) {
        this.chartData = {
          ...this.chartData,
          datasets: [
            {
              ...this.chartData.datasets[0],
              data: [resumen.bad, resumen.regular, resumen.good],
            },
          ],
        };
      }
    });
  }
}
