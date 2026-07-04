import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Estateservice } from '../../../../services/estateservice';

@Component({
  selector: 'app-above-average-rents-report',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './above-average-rents-report.html',
  styleUrl: './above-average-rents-report.css',
})
export class AboveAverageRentsReport implements OnInit {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  barChartType: ChartType = 'bar';

  constructor(private estateService: Estateservice) {}

  ngOnInit(): void {
    this.estateService.aboveAverageRents().subscribe((data) => {
      this.hasData = data.length > 0;
      this.barChartLabels = data.map((item) => item.title);
      this.barChartData = [
        {
          data: data.map((item) => item.montlhy_price),
          label: 'Precio mensual',
          backgroundColor: '#d94b63',
        },
      ];
    });
  }
}
