import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { Contractservice } from '../../../../services/contractservice';
import { ContractRevenueDistrictDTO } from '../../../../models/reports/contract/contract-revenue-district-dto';

@Component({
  selector: 'app-contract-revenue-by-district',
  imports: [MatCardModule, MatIconModule, BaseChartDirective],
  templateUrl: './contract-revenue-by-district.html',
  styleUrl: './contract-revenue-by-district.css',
})
export class ContractRevenueByDistrict implements OnInit {
  distritos: ContractRevenueDistrictDTO[] = [];

  private readonly maxItemsEnBarChart = 10;
  private readonly maxSegmentosEnDoughnut = 5;

  private readonly paletaColores = [
    '#64b5f6', '#81c784', '#ffd54f', '#e57373',
    '#ba68c8', '#4db6ac', '#f06292', '#a1887f', '#90a4ae',
  ];

  // --- Bar chart: comparativa de montos ---
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Ingreso total',
        data: [],
        backgroundColor: '#64b5f6',
      },
    ],
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
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

  // --- Doughnut chart: participacion sobre el total ---
  doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: this.paletaColores,
      },
    ],
  };

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  constructor(private cS: Contractservice) {}

  ngOnInit(): void {
    this.cargarIngresosPorDistrito();
  }

  cargarIngresosPorDistrito() {
    this.cS.revenueByDistrict().subscribe((data) => {
      this.distritos = data;
      this.actualizarBarChart();
      this.actualizarDoughnutChart();
    });
  }

  private actualizarBarChart() {
    const top = [...this.distritos]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, this.maxItemsEnBarChart);

    this.barChartData = {
      labels: top.map((d) => d.district),
      datasets: [
        {
          ...this.barChartData.datasets[0],
          data: top.map((d) => d.totalRevenue),
        },
      ],
    };
  }

  private actualizarDoughnutChart() {
    const ordenados = [...this.distritos].sort((a, b) => b.totalRevenue - a.totalRevenue);
    const principales = ordenados.slice(0, this.maxSegmentosEnDoughnut);
    const resto = ordenados.slice(this.maxSegmentosEnDoughnut);

    const labels = principales.map((d) => d.district);
    const data = principales.map((d) => d.totalRevenue);

    if (resto.length > 0) {
      const sumaResto = resto.reduce((acc, d) => acc + d.totalRevenue, 0);
      labels.push('Otros');
      data.push(sumaResto);
    }

    this.doughnutChartData = {
      ...this.doughnutChartData,
      labels,
      datasets: [
        {
          ...this.doughnutChartData.datasets[0],
          data,
        },
      ],
    };
  }
}
