import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { AuthService } from '../../../services/auth.service';
import { DashboardService, ClientMetrics, TopClient } from '../../../services/dashboard.service';

interface ServiceCase {
    id: string;
    title: string;
    status: 'Abierto' | 'En progreso' | 'Resuelto' | 'Cerrado';
    priority: 'Alta' | 'Media' | 'Baja';
    createdDate: Date;
    resolvedDate?: Date;
    rating?: number;
}

@Component({
    selector: 'app-service-dashboard',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        CardModule, 
        RatingModule, 
        ChartModule, 
        TableModule, 
        TagModule,
        ProgressBarModule
    ],
    template: `
        <div class="space-y-6">
            <!-- Header -->
            <div class="bg-skandia-blue rounded-xl p-8 text-white shadow-skandia-medium">
                <h1 class="text-3xl font-bold mb-2" style="font-family: var(--font-family-headings);">
                    Bitácora de Servicios
                </h1>
                <p class="text-xl opacity-90 body-1">
                    Gestión y seguimiento de casos de servicio al cliente
                </p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Total Casos</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                                {{ getTotalCases() }}
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-blue-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-ticket text-lg lg:text-2xl text-skandia-blue dark:text-blue-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Casos Resueltos</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-green" style="font-family: var(--font-family-headings);">
                                {{ getResolvedCases() }}
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-green-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-check-circle text-lg lg:text-2xl text-skandia-green dark:text-green-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Casos en Progreso</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-orange" style="font-family: var(--font-family-headings);">
                                {{ getInProgressCases() }}
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-orange-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-clock text-lg lg:text-2xl text-skandia-orange dark:text-orange-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Tiempo Promedio</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-blue" style="font-family: var(--font-family-headings);">
                                {{ getAverageResolutionTime() }}h
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-purple-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-stopwatch text-lg lg:text-2xl text-skandia-blue dark:text-purple-400"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Resolution Status Chart -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                            Estado de Resolución
                        </h3>
                    </div>
                    <div class="p-6">
                        <p-chart type="bar" [data]="resolutionChartData" [options]="chartOptions" class="h-64" />
                    </div>
                </div>

                <!-- Customer Satisfaction -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                            Satisfacción del Cliente
                        </h3>
                    </div>
                    <div class="p-6">
                        <div class="text-center mb-6">
                            <div class="text-4xl font-bold text-skandia-green mb-2" style="font-family: var(--font-family-headings);">
                                {{ averageRating.toFixed(1) }}
                            </div>
                            <p-rating 
                                [(ngModel)]="averageRating" 
                                [readonly]="true" 
                                [stars]="5"
                                class="mb-2"
                            />
                            <p class="text-skandia-gray-5 dark:text-gray-400 body-3">
                                Promedio de {{ getTotalRatedCases() }} evaluaciones
                            </p>
                        </div>
                        
                        <div class="space-y-3">
                            <div *ngFor="let rating of ratingDistribution" class="flex items-center gap-3">
                                <span class="text-sm font-medium text-skandia-gray dark:text-white body-3 w-8">{{ rating.stars }}★</span>
                                <div class="flex-1 bg-skandia-light-gray dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        class="bg-skandia-green h-2 rounded-full transition-all duration-300"
                                        [style.width.%]="rating.percentage"
                                    ></div>
                                </div>
                                <span class="text-sm text-skandia-gray-5 dark:text-gray-400 body-4 w-12 text-right">{{ rating.count }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cases Table -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                        Casos Recientes
                    </h3>
                </div>
                <div class="p-6">
                    <p-table [value]="serviceCases" [tableStyle]="{'min-width': '50rem'}">
                        <ng-template #header>
                            <tr>
                                <th class="text-skandia-gray dark:text-white body-3">Caso</th>
                                <th class="text-skandia-gray dark:text-white body-3">Estado</th>
                                <th class="text-skandia-gray dark:text-white body-3">Prioridad</th>
                                <th class="text-skandia-gray dark:text-white body-3">Fecha Creación</th>
                                <th class="text-skandia-gray dark:text-white body-3">Calificación</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-case>
                            <tr>
                                <td class="text-skandia-gray dark:text-white body-2">{{ case.title }}</td>
                                <td>
                                    <p-tag 
                                        [value]="case.status" 
                                        [severity]="getStatusSeverity(case.status)"
                                        class="shadow-skandia-subtle"
                                    />
                                </td>
                                <td>
                                    <p-tag 
                                        [value]="case.priority" 
                                        [severity]="getPrioritySeverity(case.priority)"
                                        class="shadow-skandia-subtle"
                                    />
                                </td>
                                <td class="text-skandia-gray dark:text-white body-2">{{ formatDate(case.createdDate) }}</td>
                                <td>
                                    <p-rating 
                                        *ngIf="case.rating" 
                                        [ngModel]="case.rating" 
                                        [readonly]="true"
                                        [stars]="5"
                                    />
                                    <span *ngIf="!case.rating" class="text-skandia-gray-5 dark:text-gray-400 body-4">Sin calificar</span>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>
    `
})
export class ServiceDashboard {
    private authService = inject(AuthService);
    private dashboardService = inject(DashboardService);

    currentUser = computed(() => this.authService.getCurrentUser()());
    
    metrics: ClientMetrics;
    topClientsByBalance: TopClient[];
    topClientsByTransactions: TopClient[];

    serviceCases: ServiceCase[] = [
        {
            id: '1',
            title: 'Problema con transferencias',
            status: 'En progreso',
            priority: 'Alta',
            createdDate: new Date('2024-01-15'),
            resolvedDate: undefined,
            rating: undefined
        },
        {
            id: '2',
            title: 'Consulta sobre saldos',
            status: 'Resuelto',
            priority: 'Media',
            createdDate: new Date('2024-01-10'),
            resolvedDate: new Date('2024-01-12'),
            rating: 5
        },
        {
            id: '3',
            title: 'Error en reporte mensual',
            status: 'Cerrado',
            priority: 'Baja',
            createdDate: new Date('2024-01-08'),
            resolvedDate: new Date('2024-01-14'),
            rating: 4
        }
    ];

    averageRating: number = 4.2;

    ratingDistribution = [
        { stars: 5, count: 45, percentage: 60 },
        { stars: 4, count: 20, percentage: 27 },
        { stars: 3, count: 8, percentage: 11 },
        { stars: 2, count: 2, percentage: 2 },
        { stars: 1, count: 0, percentage: 0 }
    ];

    resolutionChartData: any;
    chartOptions: any;

    constructor() {
        this.metrics = this.dashboardService.getClientMetrics();
        this.topClientsByBalance = this.dashboardService.getTopClientsByBalance();
        this.topClientsByTransactions = this.dashboardService.getTopClientsByTransactions();
        this.initChart();
    }

    initChart() {
        this.resolutionChartData = {
            labels: ['Abierto', 'En progreso', 'Resuelto', 'Cerrado'],
            datasets: [
                {
                    label: 'Casos',
                    backgroundColor: ['#ef4444', '#F29F05', '#00C83C', '#02B1FF'],
                    data: [5, 12, 45, 38]
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#878787'
                    },
                    grid: {
                        color: '#EDEDED'
                    }
                },
                y: {
                    ticks: {
                        color: '#878787'
                    },
                    grid: {
                        color: '#EDEDED'
                    }
                }
            }
        };
    }

    getTotalCases(): number {
        return this.serviceCases.length;
    }

    getResolvedCases(): number {
        return this.serviceCases.filter(c => c.status === 'Resuelto' || c.status === 'Cerrado').length;
    }

    getInProgressCases(): number {
        return this.serviceCases.filter(c => c.status === 'En progreso').length;
    }

    getAverageResolutionTime(): number {
        const resolvedCases = this.serviceCases.filter(c => c.resolvedDate);
        if (resolvedCases.length === 0) return 0;
        
        const totalHours = resolvedCases.reduce((sum, c) => {
            const hours = (c.resolvedDate!.getTime() - c.createdDate.getTime()) / (1000 * 60 * 60);
            return sum + hours;
        }, 0);
        
        return Math.round(totalHours / resolvedCases.length);
    }

    getTotalRatedCases(): number {
        return this.serviceCases.filter(c => c.rating).length;
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'Resuelto':
            case 'Cerrado': return 'success';
            case 'En progreso': return 'info';
            case 'Abierto': return 'danger';
            default: return 'secondary';
        }
    }

    getPrioritySeverity(priority: string): string {
        switch (priority) {
            case 'Alta': return 'danger';
            case 'Media': return 'warn';
            case 'Baja': return 'success';
            default: return 'secondary';
        }
    }

    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    formatNumber(value: number): string {
        return new Intl.NumberFormat('es-ES').format(value);
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }
}