import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../services/auth.service';
import { DashboardService, ClientMetrics, TopClient } from '../../../services/dashboard.service';

@Component({
    selector: 'app-implementation-log',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
        <div class="space-y-6">
            <!-- Welcome Header -->
            <div class="bg-skandia-green rounded-xl p-8 text-white shadow-skandia-medium">
                <h1 class="text-3xl font-bold mb-2" style="font-family: var(--font-family-headings);">
                    Bienvenido al Portal MIGO
                </h1>
                <p class="text-xl opacity-90 mb-2 body-1">{{ currentUser()?.name }}</p>
                <p class="text-base opacity-75 body-3">
                    Último ingreso: {{ formatLastLogin() }}
                </p>
            </div>

            <!-- Metrics Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Total de Clientes</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                                {{ formatNumber(metrics.totalClients) }}
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-blue-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-users text-lg lg:text-2xl text-skandia-blue dark:text-blue-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Clientes Activos</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-green" style="font-family: var(--font-family-headings);">
                                {{ formatNumber(metrics.activeClients) }}
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
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Recursos Administrados</p>
                            <p class="text-lg lg:text-2xl font-bold text-skandia-blue" style="font-family: var(--font-family-headings);">
                                {{ formatCurrency(metrics.totalAssets) }}
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-purple-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-dollar text-lg lg:text-2xl text-skandia-blue dark:text-purple-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">En Implementación</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-orange" style="font-family: var(--font-family-headings);">
                                {{ formatNumber(metrics.implementationClients) }}
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-orange-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-cog text-lg lg:text-2xl text-skandia-orange dark:text-orange-400"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Clients Cards -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Top Clients by Balance -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 class="text-xl font-bold text-skandia-gray dark:text-white flex items-center" style="font-family: var(--font-family-headings);">
                            <i class="pi pi-chart-line text-skandia-blue mr-3"></i>
                            Top Clientes por Saldo
                        </h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <div *ngFor="let client of topClientsByBalance; let i = index" 
                                 class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-skandia-light-gray dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3 shadow-skandia-subtle">
                                        <span class="text-sm font-bold text-skandia-blue dark:text-blue-400 body-3">{{ i + 1 }}</span>
                                    </div>
                                    <div>
                                        <p class="font-medium text-skandia-gray dark:text-white body-2">{{ client.name }}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-skandia-green body-2">{{ formatCurrency(client.balance) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Clients by Transactions -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 class="text-xl font-bold text-skandia-gray dark:text-white flex items-center" style="font-family: var(--font-family-headings);">
                            <i class="pi pi-sync text-skandia-orange mr-3"></i>
                            Top Clientes por Transaccionalidad
                        </h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <div *ngFor="let client of topClientsByTransactions; let i = index" 
                                 class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-skandia-light-gray dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3 shadow-skandia-subtle">
                                        <span class="text-sm font-bold text-skandia-orange dark:text-purple-400 body-3">{{ i + 1 }}</span>
                                    </div>
                                    <div>
                                        <p class="font-medium text-skandia-gray dark:text-white body-2">{{ client.name }}</p>
                                        <p class="text-sm text-skandia-gray-5 dark:text-gray-400 body-4">{{ client.operations }} operaciones/mes</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-skandia-green body-2">{{ formatCurrency(client.balance) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ImplementationLog {
    private authService = inject(AuthService);
    private dashboardService = inject(DashboardService);

    currentUser = computed(() => this.authService.getCurrentUser()());
    
    metrics: ClientMetrics;
    topClientsByBalance: TopClient[];
    topClientsByTransactions: TopClient[];

    constructor() {
        this.metrics = this.dashboardService.getClientMetrics();
        this.topClientsByBalance = this.dashboardService.getTopClientsByBalance();
        this.topClientsByTransactions = this.dashboardService.getTopClientsByTransactions();
    }

    formatLastLogin(): string {
        const lastLogin = this.currentUser()?.lastLogin;
        if (!lastLogin) return 'Primera vez';
        
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(lastLogin));
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