import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {
  AboveAverageRentsDTO,
  EstatePricePerRoomDTO,
  EstatePriceRangeDTO,
  EstateUsersDTO,
  OwnerEstateDTO,
} from '../../../models/Estate';
import { Estateservice } from '../../../services/estateservice';

import { CommonModule } from '@angular/common';

// npm install chart.js ng2-charts
@Component({
  selector: 'app-estate-reports',
  imports: [BaseChartDirective, MatIconModule, CommonModule],
  templateUrl: './estate-reports.html',
  styleUrl: './estate-reports.css',
})
export class EstateReports implements OnInit, OnChanges {
  @Input() reportKey: string = '';
  @Input() districtParam: string = '';
  @Input() cityParam: string = '';
  @Input() typeParam: string = '';

  hasData = false;
  isLoading = false;

 
  barChartOptions: ChartOptions = { responsive: true };
  barChartLegend = true;
  barChartLabels: string[] = [];
  barChartData: ChartDataset[] = [];
  barChartType: ChartType = 'bar';

  constructor(private eS: Estateservice, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.reportKey) {
      this.cargarReporte();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportKey'] && !changes['reportKey'].firstChange) {
      this.resetChart();
      this.cargarReporte();
    }
    if (changes['districtParam'] && !changes['districtParam'].firstChange && this.reportKey === 'by-district') {
      this.resetChart();
      this.cargarReporte();
    }
  }

  cargarReporte(): void {
    if (!this.reportKey) return;

    switch (this.reportKey) {
      case 'owners-estates':
        this.isLoading = true;
        this.barChartType = 'bar';
        this.barChartOptions = { responsive: true };
        this.eS.ownersEstates().subscribe((data: OwnerEstateDTO[]) => {
          this.isLoading = false;
          if (data.length > 0) {
            this.hasData = true;
            this.barChartLabels = data.map((d) => `${d.name} ${d.lastname}`);
            this.barChartData = [
              {
                data: data.map((d) => d.monthlyPrice),
                label: 'Precio mensual (S/.)',
                backgroundColor: [
                  '#d72b04f5',
                  '#f40b03e0',
                  'rgb(194, 41, 31)',
                  'rgba(230, 77, 77, 0.5)',
                  'rgb(148, 14, 4)',
                ],
              },
              {
                data: data.map((d) => d.rooms),
                label: 'Habitaciones',
                backgroundColor: 'rgba(100,200,150,0.55)',
                borderColor: '#64c896',
                borderWidth: 1.5,
                type: 'line',
              } as ChartDataset,
            ];
            this.cdr.detectChanges();
          } else {
            this.hasData = false;
          }
        });
        break;

      case 'above-average':
        this.isLoading = true;
        this.barChartType = 'bar';
        this.barChartOptions = { responsive: true, indexAxis: 'y' } as ChartOptions;
        this.eS.aboveAverageRents().subscribe((data: AboveAverageRentsDTO[]) => {
          this.isLoading = false;
          if (data.length > 0) {
            this.hasData = true;
            this.barChartLabels = data.map((d) => d.title);
            this.barChartData = [
              {
                data: data.map((d) => d.montlhy_price),
                label: 'Precio mensual (S/.)',
                backgroundColor: data.map(
                  (_, i) => `hsl(${200 + i * 18}, 72%, ${50 + (i % 3) * 8}%)`
                ),
                borderColor: '#2d7fd3',
                borderWidth: 1,
              },
            ];
            this.cdr.detectChanges();
          } else {
            this.hasData = false;
          }
        });
        break;

      case 'best-price-per-room':
        this.isLoading = true;
        this.barChartType = 'bar';
        this.barChartOptions = { responsive: true };
        this.eS.bestPricePerRoom().subscribe((data: EstatePricePerRoomDTO[]) => {
          this.isLoading = false;
          if (data.length > 0) {
            this.hasData = true;
            this.barChartLabels = data.map((d) => d.title);
            this.barChartData = [
              {
                data: data.map((d) => +d.pricePerRoom.toFixed(2)),
                label: 'Precio por habitación (S/.)',
                backgroundColor: 'rgba(245,158,11,0.78)',
                borderColor: '#f59e0b',
                borderWidth: 1.5,
              },
            ];
            this.cdr.detectChanges();
          } else {
            this.hasData = false;
          }
        });
        break;

      case 'price-range':
        this.isLoading = true;
        this.barChartType = 'bar';
        this.barChartOptions = { responsive: true };
        this.eS.priceRangeDistribution().subscribe((data: EstatePriceRangeDTO[]) => {
          this.isLoading = false;
          if (data.length > 0) {
            this.hasData = true;
            this.barChartLabels = data.map((d) => d.type);
            this.barChartData = [
              {
                data: data.map((d) => d.lowRange),
                label: 'Rango bajo (<1000)',
                backgroundColor: 'rgba(16,185,129,0.78)',
                borderColor: '#10b981',
                borderWidth: 1,
              },
              {
                data: data.map((d) => d.midRange),
                label: 'Rango medio (1000–3000)',
                backgroundColor: 'rgba(245,158,11,0.78)',
                borderColor: '#f59e0b',
                borderWidth: 1,
              },
              {
                data: data.map((d) => d.highRange),
                label: 'Rango alto (>3000)',
                backgroundColor: 'rgba(239,68,68,0.78)',
                borderColor: '#ef4444',
                borderWidth: 1,
              },
            ];
            this.cdr.detectChanges();
          } else {
            this.hasData = false;
          }
        });
        break;

      case 'by-district':
        if (!this.districtParam?.trim()) return;
        this.isLoading = true;
        this.barChartType = 'doughnut';
        this.barChartOptions = { responsive: true };
        this.eS.estatesByDistrict(this.districtParam.trim()).subscribe((data: EstateUsersDTO[]) => {
          this.isLoading = false;
          if (data.length > 0) {
            this.hasData = true;
            this.barChartLabels = data.map((d) => `${d.name} ${d.lastname}`);
            this.barChartData = [
              {
                data: data.map((d) => d.monthlyPrice),
                label: 'Precio mensual (S/.)',
                backgroundColor: data.map((_, i) => `hsl(${(i * 47) % 360}, 70%, 58%)`),
                borderWidth: 2,
              },
            ];
            this.cdr.detectChanges();
          } else {
            this.hasData = false;
          }
        });
        break;

      case 'multi-filter':
        if (!this.cityParam?.trim() || !this.districtParam?.trim() || !this.typeParam?.trim()) return;
        this.isLoading = true;
        this.barChartType = 'bar';
        this.barChartOptions = { responsive: true };
        this.eS
          .filtroEstate(this.cityParam.trim(), this.districtParam.trim(), this.typeParam.trim())
          .subscribe((data: any[]) => {
            this.isLoading = false;
            if (data.length > 0) {
              this.hasData = true;
              this.barChartLabels = data.map((d) => d.title);
              this.barChartData = [
                {
                  data: data.map((d) => d.monthlyPrice),
                  label: 'Precio mensual (S/.)',
                  backgroundColor: 'rgba(45,127,211,0.78)',
                  borderColor: '#2d7fd3',
                  borderWidth: 1.5,
                },
              ];
              this.cdr.detectChanges();
            } else {
              this.hasData = false;
            }
          });
        break;
    }
  }

  private resetChart(): void {
    this.hasData = false;
    this.barChartLabels = [];
    this.barChartData = [];
  }
}