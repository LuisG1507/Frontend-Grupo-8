import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { Reviewservice } from '../../../../services/reviewservice';
import { ReviewsReviewsLessorRatingDTO } from '../../../../models/reports/review/reviews-reviews-lessor-rating-dto';

@Component({
  selector: 'app-review-lessor-rating',
  imports: [MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './review-lessor-rating.html',
  styleUrl: './review-lessor-rating.css',
})
export class ReviewLessorRating implements OnInit {
  arrendadores: ReviewsReviewsLessorRatingDTO[] = [];

  private readonly maxItemsEnChart = 10;

  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Calificacion promedio',
        data: [],
        backgroundColor: '#81c784',
      },
    ],
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  constructor(private rS: Reviewservice) {}

  ngOnInit(): void {
    this.cargarMejoresArrendadores();
  }

  cargarMejoresArrendadores() {
    this.rS.bestLessors().subscribe((data) => {
      this.arrendadores = data;
      this.actualizarChart();
    });
  }

  private actualizarChart() {
    const topArrendadores = this.arrendadores.slice(0, this.maxItemsEnChart);

    this.chartData = {
      labels: topArrendadores.map((a) => `${a.name} ${a.lastName}`),
      datasets: [
        {
          ...this.chartData.datasets[0],
          data: topArrendadores.map((a) => a.average),
        },
      ],
    };
  }
}
