import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ReviewsBelowAverageDTO } from '../../../../models/reports/review/reviews-below-average-dto';
import { Reviewservice } from '../../../../services/reviewservice';

@Component({
  selector: 'app-reviews-below-average',
  imports: [MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './reviews-below-average.html',
  styleUrl: './reviews-below-average.css',
})
export class ReviewsBelowAverage implements OnInit {
  inmuebles: ReviewsBelowAverageDTO[] = [];

  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Calificacion promedio',
        data: [],
        backgroundColor: '#e57373',
      },
    ],
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // barras horizontales, mejor para nombres largos
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 5, // ajusta segun tu escala de calificaciones
      },
    },
  };

  constructor(private rS: Reviewservice) {}

  ngOnInit(): void {
    this.cargarInmueblesDebajoDelPromedio();
  }

  cargarInmueblesDebajoDelPromedio() {
    this.rS.belowAverage().subscribe((data) => {
      this.inmuebles = data;

      this.chartData = {
        labels: this.inmuebles.map((i) => i.title),
        datasets: [
          {
            ...this.chartData.datasets[0],
            data: this.inmuebles.map((i) => i.average),
          },
        ],
      };
    });
  }
}
