import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Estateservice } from '../../../../services/estateservice';

@Component({
  selector: 'app-district-estates-report',
  imports: [
    BaseChartDirective,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './district-estates-report.html',
  styleUrl: './district-estates-report.css',
})
export class DistrictEstatesReport {
  district = '';
  hasSearched = false;
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

  search(): void {
    const district = this.district.trim();
    if (!district) {
      return;
    }

    this.estateService.estatesByDistrict(district).subscribe((data) => {
      this.hasSearched = true;
      this.hasData = data.length > 0;
      this.barChartLabels = data.map((item) => `${item.name} ${item.lastname}`);
      this.barChartData = [
        {
          data: data.map((item) => item.monthlyPrice),
          label: 'Precio mensual',
          backgroundColor: '#5b8c5a',
        },
      ];
    });
  }
}
