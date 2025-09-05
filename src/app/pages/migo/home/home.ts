import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../services/auth.service';
import { DashboardService, ClientMetrics, TopClient } from '../../../services/dashboard.service';

@Component({
    selector: 'app-migo-home',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
        <div class="space-y-6">
            <!-- Welcome Header -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                <h1 class="text-3xl font-bold mb-2">
                    Bienvenido al Portal MIGO
                </h1>
                <p class="text-xl opacity-90 mb-1">{{ currentUser()?.name }}</p>
                <p class="text-sm opacity-75">
                    Último ingreso: {{ formatLastLogin() }}
                </p>
            </div>

            <!-- Metrics Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Clientes</p>
                            <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                {{ formatNumber(metrics.totalClients) }}
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <i class="pi pi-users text-2xl text-blue-600 dark:text-blue-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes Activos</p>
                            <p class="text-3xl font-bold text-green-600">
                                {{ formatNumber(metrics.activeClients) }}
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <i class="pi pi-check-circle text-2xl text-green-600 dark:text-green-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Recursos Administrados</p>
                            <p class="text-3xl font-bold text-purple-600">
                                {{ formatCurrency(metrics.totalAssets) }}
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <i class="pi pi-dollar text-2xl text-purple-600 dark:text-purple-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">En Implementación</p>
                            <p class="text-3xl font-bold text-orange-600">
                                {{ formatNumber(metrics.implementationClients) }}
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                            <i class="pi pi-cog text-2xl text-orange-600 dark:text-orange-400"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top Clients Cards -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Top Clients by Balance -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            <i class="pi pi-chart-line text-blue-600 mr-3"></i>
                            Top Clientes por Saldo
                        </h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <div *ngFor="let client of topClientsByBalance; let i = index" 
                                 class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                                        <span class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ i + 1 }}</span>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900 dark:text-white">{{ client.name }}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-green-600">{{ formatCurrency(client.balance) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Clients by Transactions -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            <i class="pi pi-sync text-purple-600 mr-3"></i>
                            Top Clientes por Transaccionalidad
                        </h3>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <div *ngFor="let client of topClientsByTransactions; let i = index" 
                                 class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div class="flex items-center">
                                    <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                                        <span class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ i + 1 }}</span>
                                    </div>
                                    <div>
                                        <p class="font-medium text-gray-900 dark:text-white">{{ client.name }}</p>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ client.operations }} operaciones/mes</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-green-600">{{ formatCurrency(client.balance) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class MigoHome {
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