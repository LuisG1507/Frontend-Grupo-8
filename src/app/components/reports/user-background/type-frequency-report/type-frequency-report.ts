import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Backgroundservice } from '../../../../services/backgroundservice';

@Component({
  selector: 'app-type-frequency-report',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './type-frequency-report.html',
  styleUrl: './type-frequency-report.css',
})
export class TypeFrequencyReport implements OnInit {
  hasData = false;
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  barChartType: ChartType = 'doughnut';

  constructor(private backgroundService: Backgroundservice) {}

  ngOnInit(): void {
    this.backgroundService.getTypeFrequency().subscribe((data) => {
      this.hasData = data.length > 0;
      this.barChartLabels = data.map((item) => item.type);
      this.barChartData = [
        {
          data: data.map((item) => item.total),
          label: 'Cantidad de antecedentes',
          backgroundColor: ['#2d7fd3', '#16a3b8', '#f59e0b', '#d94b63', '#5b8c5a'],
        },
      ];
    });
  }
}
