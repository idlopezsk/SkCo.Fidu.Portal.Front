import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { RatingModule } from 'primeng/rating';

interface ServiceMetrics {
    totalCases: number;
    resolvedCases: number;
    inProgressCases: number;
    averageResolutionTime: number;
}

interface ResolutionStatus {
    status: string;
    count: number;
    color: string;
}

@Component({
    selector: 'app-service-dashboard',
    standalone: true,
    imports: [CommonModule, ChartModule, RatingModule],
    template: `
        <div class="space-y-6">
            <!-- Header -->
            <div class="bg-skandia-green rounded-xl p-6 text-white shadow-skandia-medium">
                <h1 class="text-3xl font-bold mb-2" style="font-family: var(--font-family-headings);">
                    Bitácora de Servicios
                </h1>
                <p class="text-xl opacity-90 body-1">
                    Panel de control y seguimiento de casos de servicio
                </p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3">Total de Casos</p>
                            <p class="text-3xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                                {{ formatNumber(metrics.totalCases) }}
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-skandia-light-gray dark:bg-blue-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-file text-2xl text-skandia-blue dark:text-blue-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3">Casos Resueltos</p>
                            <p class="text-3xl font-bold text-skandia-green" style="font-family: var(--font-family-headings);">
                                {{ formatNumber(metrics.resolvedCases) }}
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-skandia-light-gray dark:bg-green-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-check-circle text-2xl text-skandia-green dark:text-green-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3">Casos en Progreso</p>
                            <p class="text-3xl font-bold text-skandia-orange" style="font-family: var(--font-family-headings);">
                                {{ formatNumber(metrics.inProgressCases) }}
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-skandia-light-gray dark:bg-orange-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-clock text-2xl text-skandia-orange dark:text-orange-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3">Tiempo Promedio Resolución</p>
                            <p class="text-3xl font-bold text-skandia-blue" style="font-family: var(--font-family-headings);">
                                {{ metrics.averageResolutionTime }}h
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-skandia-light-gray dark:bg-purple-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-stopwatch text-2xl text-skandia-blue dark:text-purple-400"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Resolution Status Chart -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 class="text-xl font-bold text-skandia-gray dark:text-white flex items-center" style="font-family: var(--font-family-headings);">
                            <i class="pi pi-chart-bar text-skandia-blue mr-3"></i>
                            Estado de Resolución
                        </h3>
                    </div>
                    <div class="p-6">
                        <p-chart type="bar" [data]="resolutionChartData" [options]="resolutionChartOptions" class="h-64" />
                    </div>
                </div>

                <!-- Customer Satisfaction -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 class="text-xl font-bold text-skandia-gray dark:text-white flex items-center" style="font-family: var(--font-family-headings);">
                            <i class="pi pi-star text-skandia-orange mr-3"></i>
                            Satisfacción del Cliente
                        </h3>
                    </div>
                    <div class="p-6">
                        <div class="text-center mb-6">
                            <div class="text-4xl font-bold text-skandia-orange mb-2" style="font-family: var(--font-family-headings);">
                                {{ averageRating.toFixed(1) }}
                            </div>
                            <p-rating 
                                [ngModel]="averageRating" 
                                [readonly]="true" 
                                [stars]="5"
                                class="mb-2"
                            />
                            <p class="text-skandia-gray-5 dark:text-gray-400 body-3">
                                Basado en {{ totalReviews }} evaluaciones
                            </p>
                        </div>
                        
                        <div class="space-y-3">
                            <div *ngFor="let rating of ratingDistribution" class="flex items-center gap-3">
                                <span class="text-sm text-skandia-gray dark:text-white body-3 w-8">{{ rating.stars }}★</span>
                                <div class="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                    <div 
                                        class="bg-skandia-orange h-2 rounded-full transition-all duration-300"
                                        [style.width.%]="rating.percentage"
                                    ></div>
                                </div>
                                <span class="text-sm text-skandia-gray-5 dark:text-gray-400 body-4 w-12">{{ rating.count }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ServiceDashboard {
    metrics: ServiceMetrics = {
        totalCases: 1247,
        resolvedCases: 1089,
        inProgressCases: 158,
        averageResolutionTime: 24
    };

    resolutionStatusData: ResolutionStatus[] = [
        { status: 'Resueltos', count: 1089, color: '#00C83C' },
        { status: 'En Progreso', count: 158, color: '#F29F05' },
        { status: 'Pendientes', count: 45, color: '#ef4444' },
        { status: 'Escalados', count: 23, color: '#02B1FF' }
    ];

    averageRating: number = 4.3;
    totalReviews: number = 892;
    
    ratingDistribution = [
        { stars: 5, count: 456, percentage: 51.1 },
        { stars: 4, count: 298, percentage: 33.4 },
        { stars: 3, count: 89, percentage: 10.0 },
        { stars: 2, count: 34, percentage: 3.8 },
        { stars: 1, count: 15, percentage: 1.7 }
    ];

    resolutionChartData: any;
    resolutionChartOptions: any;

    constructor() {
        this.initCharts();
    }

    initCharts() {
        this.resolutionChartData = {
            labels: this.resolutionStatusData.map(d => d.status),
            datasets: [
                {
                    label: 'Casos',
                    backgroundColor: this.resolutionStatusData.map(d => d.color),
                    data: this.resolutionStatusData.map(d => d.count)
                }
            ]
        };

        this.resolutionChartOptions = {
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
                        display: false
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

    formatNumber(value: number): string {
        return new Intl.NumberFormat('es-ES').format(value);
    }
}