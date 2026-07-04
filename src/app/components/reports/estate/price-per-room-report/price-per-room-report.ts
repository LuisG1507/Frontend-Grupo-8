import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Estateservice } from '../../../../services/estateservice';

@Component({
  selector: 'app-price-per-room-report',
  imports: [BaseChartDirective, MatIconModule],
  templateUrl: './price-per-room-report.html',
  styleUrl: './price-per-room-report.css',
})
export class PricePerRoomReport implements OnInit {
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
    this.estateService.bestPricePerRoom().subscribe((data) => {
      this.hasData = data.length > 0;
      this.barChartLabels = data.map((item) => item.title);
      this.barChartData = [
        {
          data: data.map((item) => item.pricePerRoom),
          label: 'Precio por habitación',
          backgroundColor: '#f59e0b',
        },
      ];
    });
  }
}
