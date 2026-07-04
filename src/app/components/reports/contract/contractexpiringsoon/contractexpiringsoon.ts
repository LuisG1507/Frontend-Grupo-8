import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ContractExpiringDTO } from '../../../../models/reports/contract/contract-expiring-dto';
import { Contractservice } from '../../../../services/contractservice';

@Component({
  selector: 'app-contractexpiringsoon',
  imports: [MatCardModule, MatIconModule, DatePipe, BaseChartDirective],
  templateUrl: './contractexpiringsoon.html',
  styleUrl: './contractexpiringsoon.css',
})
export class Contractexpiringsoon implements OnInit {
  contratos: ContractExpiringDTO[] = [];

  private readonly maxItemsEnChart = 10;

  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Dias restantes',
        data: [],
        backgroundColor: '#e57373',
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
      },
    },
  };

  constructor(private cS: Contractservice) {}

  ngOnInit(): void {
    this.cargarContratosPorVencer();
  }

  cargarContratosPorVencer() {
    this.cS.expiringSoon().subscribe((data) => {
      this.contratos = data;
      this.actualizarChart();
    });
  }

  private actualizarChart() {
    const masUrgentes = [...this.contratos]
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, this.maxItemsEnChart);

    this.chartData = {
      labels: masUrgentes.map((c) => c.estateTitle),
      datasets: [
        {
          ...this.chartData.datasets[0],
          data: masUrgentes.map((c) => c.daysRemaining),
        },
      ],
    };
  }
}
