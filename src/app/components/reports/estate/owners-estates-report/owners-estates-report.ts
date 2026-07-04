import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Estateservice } from '../../../../services/estateservice';

@Component({
  selector: 'app-owners-estates-report',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './owners-estates-report.html',
  styleUrl: './owners-estates-report.css',
})
export class OwnersEstatesReport implements OnInit {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
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
    this.estateService.ownersEstates().subscribe((data) => {
      this.hasData = data.length > 0;
      this.barChartLabels = data.map((item) => `${item.name} ${item.lastname}`);
      this.barChartData = [
        {
          data: data.map((item) => item.monthlyPrice),
          label: 'Precio mensual',
          backgroundColor: '#2d7fd3',
        },
      ];
    });
  }
}
