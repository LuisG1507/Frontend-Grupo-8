import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Userservice } from '../../../../services/userservice';

@Component({
  selector: 'app-unverified-report',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './unverified-report.html',
  styleUrl: './unverified-report.css',
})
export class UnverifiedReport implements OnInit {
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

  constructor(private userService: Userservice) {}

  ngOnInit(): void {
    this.userService.getUnverifiedWithBackgrounds().subscribe((data) => {
      this.hasData = data.length > 0;
      this.barChartLabels = data.map((item) => `${item.name} ${item.lastName}`);
      this.barChartData = [
        {
          data: data.map((item) => item.totalBackgrounds),
          label: 'Antecedentes registrados',
          backgroundColor: '#2d7fd3',
        },
      ];
    });
  }
}
