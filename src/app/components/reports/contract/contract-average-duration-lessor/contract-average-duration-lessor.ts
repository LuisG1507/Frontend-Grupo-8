import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { ContractAverageDurationDTO } from '../../../../models/reports/contract/contract-average-duration-dto';
import { Contractservice } from '../../../../services/contractservice';

@Component({
  selector: 'app-contract-average-duration-by-lessor',
  imports: [MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './contract-average-duration-lessor.html',
  styleUrl: './contract-average-duration-lessor.css',
})
export class ContractAverageDurationByLessor implements OnInit {
  arrendadores: ContractAverageDurationDTO[] = [];

  private readonly maxItemsEnChart = 10;

  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Duracion promedio (dias)',
        data: [],
        backgroundColor: '#64b5f6',
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
    this.cargarDuracionPromedioPorArrendador();
  }

  cargarDuracionPromedioPorArrendador() {
    this.cS.averageDurationByLessor().subscribe((data) => {
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
          data: topArrendadores.map((a) => a.averageDays),
        },
      ],
    };
  }
}
