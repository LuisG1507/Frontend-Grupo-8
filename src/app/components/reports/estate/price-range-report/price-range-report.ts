import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Estateservice } from '../../../../services/estateservice';

@Component({
  selector: 'app-price-range-report',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './price-range-report.html',
  styleUrl: './price-range-report.css',
})
export class PriceRangeReport implements OnInit {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  barChartType: ChartType = 'bar';

  constructor(private estateService: Estateservice) {}

  ngOnInit(): void {
    this.estateService.priceRangeDistribution().subscribe((data) => {
      this.hasData = data.length > 0;
      this.barChartLabels = data.map((item) => item.type);
      this.barChartData = [
        {
          data: data.map((item) => item.lowRange),
          label: 'Menos de S/ 500',
          backgroundColor: '#16a3b8',
        },
        {
          data: data.map((item) => item.midRange),
          label: 'Entre S/ 500 y S/ 1000',
          backgroundColor: '#f59e0b',
        },
        {
          data: data.map((item) => item.highRange),
          label: 'Más de S/ 1000',
          backgroundColor: '#d94b63',
        },
      ];
    });
  }
}
