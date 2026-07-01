import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  AboveAverageRentsDTO,
  EstatePricePerRoomDTO,
  EstatePriceRangeDTO,
  EstateUsersDTO,
  OwnerEstateDTO,
} from '../../../models/Estate';
import { Estateservice } from '../../../services/estateservice';

declare const Chart: any;

export type ReportKey =
  | 'owners-estates'
  | 'above-average'
  | 'best-price-per-room'
  | 'price-range'
  | 'by-district';

@Component({
  selector: 'app-estate-reports',
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './estate-reports.html',
  styleUrl: './estate-reports.css',
})
export class EstateReports implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() reportKey: string = '';
  @Input() districtParam: string = '';
  @Input() cityParam: string = '';
  @Input() typeParam: string = '';

  loading = false;
  errorMsg: string | null = null;
  chartDataReady = false;

  private chartInstance: any = null;

  constructor(
    private eS: Estateservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.reportKey) {
      this.cargarReporte();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reportKey'] && !changes['reportKey'].firstChange) {
      this.resetEstado();
      this.cargarReporte();
    }
    if (
      changes['districtParam'] &&
      !changes['districtParam'].firstChange &&
      this.reportKey === 'by-district'
    ) {
      this.resetEstado();
      this.cargarReporte();
    }
    if (
      (changes['cityParam'] || changes['districtParam'] || changes['typeParam']) &&
      this.reportKey === 'multi-filter' &&
      !changes['reportKey']?.firstChange
    ) {
      this.resetEstado();
      this.cargarReporte();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private resetEstado(): void {
    this.chartDataReady = false;
    this.errorMsg = null;
    this.destroyChart();
  }

  cargarReporte(): void {
    if (!this.reportKey) return;

    this.loading = true;
    this.errorMsg = null;
    this.chartDataReady = false;
    this.destroyChart();

    switch (this.reportKey) {
      case 'owners-estates':
        this.eS.ownersEstates().subscribe({
          next: (data) => this.renderOwnersEstates(data),
          error: (e) => this.handleError(e),
        });
        break;

      case 'above-average':
        this.eS.aboveAverageRents().subscribe({
          next: (data) => this.renderAboveAverage(data),
          error: (e) => this.handleError(e),
        });
        break;

      case 'best-price-per-room':
        this.eS.bestPricePerRoom().subscribe({
          next: (data) => this.renderBestPricePerRoom(data),
          error: (e) => this.handleError(e),
        });
        break;

      case 'price-range':
        this.eS.priceRangeDistribution().subscribe({
          next: (data) => this.renderPriceRange(data),
          error: (e) => this.handleError(e),
        });
        break;

      case 'by-district':
        if (!this.districtParam?.trim()) {
          this.loading = false;
          return;
        }
        this.eS.estatesByDistrict(this.districtParam.trim()).subscribe({
          next: (data) => this.renderByDistrict(data),
          error: (e) => this.handleError(e),
        });
        break;

      case 'multi-filter':
        if (!this.cityParam?.trim() || !this.districtParam?.trim() || !this.typeParam?.trim()) {
          this.loading = false;
          return;
        }
        this.eS.filtroEstate(this.cityParam.trim(), this.districtParam.trim(), this.typeParam.trim()).subscribe({
          next: (data) => this.renderMultiFilter(data),
          error: (e) => this.handleError(e),
        });
        break;
    }
  }


  private renderOwnersEstates(data: OwnerEstateDTO[]): void {
    this.loading = false;
    if (!data.length) {
      this.errorMsg = 'Sin datos para mostrar.';
      return;
    }
    setTimeout(() => {
      const labels = data.map((d) => `${d.name} ${d.lastname}`);
      this.buildChart(
        'bar',
        {
          labels,
          datasets: [
            {
              label: 'Precio mensual (S/.)',
              data: data.map((d) => d.monthlyPrice),
              backgroundColor: 'rgba(45,127,211,0.78)',
              borderColor: '#2d7fd3',
              borderWidth: 1.5,
              yAxisID: 'y',
            },
            {
              label: 'Habitaciones',
              data: data.map((d) => d.rooms),
              backgroundColor: 'rgba(100,200,150,0.78)',
              borderColor: '#64c896',
              borderWidth: 1.5,
              type: 'line',
              tension: 0.4,
              yAxisID: 'y1',
            },
          ],
        },
        {
          scales: {
            y: {
              position: 'left',
              title: { display: true, text: 'Precio mensual (S/.)' },
            },
            y1: {
              position: 'right',
              grid: { drawOnChartArea: false },
              title: { display: true, text: 'Habitaciones' },
            },
          },
        }
      );
    });
  }

  private renderAboveAverage(data: AboveAverageRentsDTO[]): void {
    this.loading = false;
    if (!data.length) {
      this.errorMsg = 'Sin datos para mostrar.';
      return;
    }
    setTimeout(() => {
      const labels = data.map((d) => d.title);
      this.buildChart(
        'bar',
        {
          labels,
          datasets: [
            {
              label: 'Precio mensual (S/.)',
              data: data.map((d) => d.montlhy_price),
              backgroundColor: data.map(
                (_, i) => `hsl(${200 + i * 18}, 72%, ${50 + (i % 3) * 8}%)`
              ),
              borderColor: '#2d7fd3',
              borderWidth: 1,
            },
          ],
        },
        {
          indexAxis: 'y',
          scales: {
            x: { title: { display: true, text: 'Precio mensual (S/.)' } },
          },
        }
      );
    });
  }

  private renderBestPricePerRoom(data: EstatePricePerRoomDTO[]): void {
    this.loading = false;
    if (!data.length) {
      this.errorMsg = 'Sin datos para mostrar.';
      return;
    }
    setTimeout(() => {
      const labels = data.map((d) => d.title);
      this.buildChart(
        'bar',
        {
          labels,
          datasets: [
            {
              label: 'Precio por habitación (S/.)',
              data: data.map((d) => +d.pricePerRoom.toFixed(2)),
              backgroundColor: 'rgba(245,158,11,0.78)',
              borderColor: '#f59e0b',
              borderWidth: 1.5,
            },
          ],
        },
        {
          scales: {
            y: { title: { display: true, text: 'S/. por habitación' } },
          },
        }
      );
    });
  }

  private renderPriceRange(data: EstatePriceRangeDTO[]): void {
    this.loading = false;
    if (!data.length) {
      this.errorMsg = 'Sin datos para mostrar.';
      return;
    }
    setTimeout(() => {
      const labels = data.map((d) => d.type);
      this.buildChart(
        'bar',
        {
          labels,
          datasets: [
            {
              label: 'Rango bajo (<1000)',
              data: data.map((d) => d.lowRange),
              backgroundColor: 'rgba(16,185,129,0.78)',
              borderColor: '#10b981',
              borderWidth: 1,
            },
            {
              label: 'Rango medio (1000–3000)',
              data: data.map((d) => d.midRange),
              backgroundColor: 'rgba(245,158,11,0.78)',
              borderColor: '#f59e0b',
              borderWidth: 1,
            },
            {
              label: 'Rango alto (>3000)',
              data: data.map((d) => d.highRange),
              backgroundColor: 'rgba(239,68,68,0.78)',
              borderColor: '#ef4444',
              borderWidth: 1,
            },
          ],
        },
        {
          scales: {
            y: { title: { display: true, text: 'Cantidad de inmuebles' } },
          },
        }
      );
    });
  }

  private renderByDistrict(data: EstateUsersDTO[]): void {
    this.loading = false;
    if (!data.length) {
      this.errorMsg = 'No se encontraron inmuebles para ese distrito.';
      return;
    }
    setTimeout(() => {
      const labels = data.map((d) => `${d.name} ${d.lastname}`);
      this.buildChart(
        'doughnut',
        {
          labels,
          datasets: [
            {
              label: 'Precio mensual (S/.)',
              data: data.map((d) => d.monthlyPrice),
              backgroundColor: labels.map(
                (_, i) => `hsl(${(i * 47) % 360}, 70%, 58%)`
              ),
              borderWidth: 2,
            },
          ],
        },
        {}
      );
    });
  }

  private renderMultiFilter(data: any[]): void {
    this.loading = false;
    if (!data.length) {
      this.errorMsg = 'No hay inmuebles con ese filtro.';
      return;
    }
    setTimeout(() => {
      const labels = data.map((d) => d.title);
      this.buildChart(
        'bar',
        {
          labels,
          datasets: [
            {
              label: 'Precio mensual (S/.)',
              data: data.map((d) => d.monthlyPrice),
              backgroundColor: 'rgba(45,127,211,0.78)',
              borderColor: '#2d7fd3',
              borderWidth: 1.5,
            },
          ],
        },
        {
          scales: {
            y: { title: { display: true, text: 'Precio mensual (S/.)' } },
          },
        }
      );
    });
  }
  private buildChart(type: string, chartData: any, extraOptions: any): void {
    if (!this.chartCanvasRef?.nativeElement) return;
    this.destroyChart();
    this.chartDataReady = true;
    const ctx = this.chartCanvasRef.nativeElement.getContext('2d');
    this.chartInstance = new Chart(ctx, {
      type,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { mode: 'index', intersect: false },
        },
        ...extraOptions,
      },
    });
  }

  private destroyChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  private handleError(e: any): void {
    this.loading = false;
    const msg =
      typeof e?.error === 'string' && e.error.trim()
        ? e.error
        : 'Error al cargar el reporte.';
    this.errorMsg = msg;
    this.snackBar.open(msg, 'Cerrar', { duration: 4500 });
  }
}
