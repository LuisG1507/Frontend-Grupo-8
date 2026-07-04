import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { Reviewservice } from '../../../../services/reviewservice';
import { ReviewsReviewsNoReviewEstateDTO } from '../../../../models/reports/review/reviews-reviews-no-review-estate-dto';

@Component({
  selector: 'app-review-no-review-estate',
  imports: [CurrencyPipe, MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './review-no-review-estate.html',
  styleUrl: './review-no-review-estate.css',
})
export class ReviewNoReviewEstate implements OnInit {
  inmuebles: ReviewsReviewsNoReviewEstateDTO[] = [];

  chartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#e57373', '#64b5f6', '#81c784', '#ffd54f',
          '#ba68c8', '#4db6ac', '#f06292', '#a1887f',
        ],
      },
    ],
  };

  chartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  constructor(private rS: Reviewservice) {}

  ngOnInit(): void {
    this.cargarInmueblesSinResenas();
  }

  cargarInmueblesSinResenas() {
    this.rS.noReviews().subscribe((data) => {
      this.inmuebles = data;
      this.actualizarChartPorCiudad();
    });
  }

  private actualizarChartPorCiudad() {
    const conteoPorCiudad = new Map<string, number>();

    for (const inmueble of this.inmuebles) {
      const actual = conteoPorCiudad.get(inmueble.city) ?? 0;
      conteoPorCiudad.set(inmueble.city, actual + 1);
    }

    this.chartData = {
      ...this.chartData,
      labels: Array.from(conteoPorCiudad.keys()),
      datasets: [
        {
          ...this.chartData.datasets[0],
          data: Array.from(conteoPorCiudad.values()),
        },
      ],
    };
  }
}
