import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Backgroundservice } from '../../../../services/backgroundservice';

@Component({
  selector: 'app-high-risk-report',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './high-risk-report.html',
  styleUrl: './high-risk-report.css',
})
export class HighRiskReport implements OnInit {
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

  constructor(private backgroundService: Backgroundservice) {}

  ngOnInit(): void {
    this.backgroundService.getHighRiskUsers().subscribe((data) => {
      this.hasData = data.length > 0;
      this.barChartLabels = data.map((item) => `${item.name} ${item.lastName}`);
      this.barChartData = [
        {
          data: data.map((item) => item.totalBackground),
          label: 'Cantidad de antecedentes',
          backgroundColor: '#d94b63',
        },
      ];
    });
  }
}
