import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

interface Client {
    id: string;
    name: string;
    documentNumber: string;
    contractNumber: string;
    status: 'Activo' | 'Inactivo';
    documentType: string;
    connectionDate: Date;
    connectionModel: string;
    clientType: string;
    productStatus: string;
    assignedAdvisor: string;
    averageMonthlyBalance: number;
    averageIncomeTicket: number;
    averageOutgoingTicket: number;
    operationsCount: number;
    transactionalCost6Months: number;
    lastDayProfitability: number;
    lastMonthProfitability: number;
    accumulatedProfitability: number;
    collections: number;
    withdrawals: number;
}

interface FlowData {
    month: string;
    income: number;
    outgoing: number;
    net: number;
    incomeMovements: number;
    outgoingMovements: number;
}

@Component({
    selector: 'app-migo-clients',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        ButtonModule, 
        InputTextModule, 
        CardModule, 
        TagModule, 
        TableModule, 
        ChartModule
    ],
    template: `
        <div class="space-y-6">
            <!-- Search Form -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                <h2 class="text-2xl font-bold text-skandia-gray dark:text-white mb-6" style="font-family: var(--font-family-headings);">
                    Búsqueda de Cliente
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label for="clientName" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Nombre o Razón Social
                        </label>
                        <input 
                            pInputText 
                            id="clientName" 
                            type="text" 
                            [(ngModel)]="searchCriteria.name"
                            placeholder="Ingrese nombre o razón social"
                            class="w-full"
                        />
                    </div>
                    
                    <div>
                        <label for="documentNumber" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            No. Documento de Identidad
                        </label>
                        <input 
                            pInputText 
                            id="documentNumber" 
                            type="text" 
                            [(ngModel)]="searchCriteria.documentNumber"
                            placeholder="Ingrese número de documento"
                            class="w-full"
                        />
                    </div>
                    
                    <div>
                        <label for="contractNumber" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            No. Contrato
                        </label>
                        <input 
                            pInputText 
                            id="contractNumber" 
                            type="text" 
                            [(ngModel)]="searchCriteria.contractNumber"
                            placeholder="Ingrese número de contrato"
                            class="w-full"
                        />
                    </div>
                </div>
                
                <div class="flex gap-3">
                    <p-button 
                        label="Buscar Cliente" 
                        icon="pi pi-search"
                        (onClick)="searchClient()"
                        [loading]="searching()"
                        class="bg-skandia-green hover:bg-green-600"
                    />
                    <p-button 
                        label="Limpiar" 
                        icon="pi pi-trash"
                        (onClick)="clearSearch()"
                        severity="secondary"
                        [outlined]="true"
                    />
                </div>
            </div>

            <!-- Search Results -->
            <div *ngIf="selectedClient()" class="space-y-6">
                <!-- Client Summary Card -->
                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                            {{ selectedClient()?.name }}
                        </h3>
                        <p-tag 
                            [value]="selectedClient()?.status" 
                            [severity]="selectedClient()?.status === 'Activo' ? 'success' : 'danger'"
                            class="shadow-skandia-subtle"
                        />
                    </div>
                    <p class="text-skandia-gray-5 dark:text-gray-400 body-2">
                        Contrato No. {{ selectedClient()?.contractNumber }}
                    </p>
                </div>

                <!-- General Information -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                            Información General
                        </h3>
                        <p-button 
                            label="Editar información" 
                            icon="pi pi-pencil"
                            severity="secondary"
                            [outlined]="true"
                            size="small"
                        />
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Documento</p>
                                <p class="text-skandia-gray dark:text-white body-2">{{ selectedClient()?.documentNumber }}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Fecha de vinculación</p>
                                <p class="text-skandia-gray dark:text-white body-2">{{ formatDate(selectedClient()?.connectionDate) }}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Modelo de conexión</p>
                                <p class="text-skandia-gray dark:text-white body-2">{{ selectedClient()?.connectionModel }}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Tipo de cliente</p>
                                <p class="text-skandia-gray dark:text-white body-2">{{ selectedClient()?.clientType }}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Estado producto</p>
                                <p class="text-skandia-gray dark:text-white body-2">{{ selectedClient()?.productStatus }}</p>
                            </div>
                            <div>
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Asesor asignado</p>
                                <p class="text-skandia-gray dark:text-white body-2">{{ selectedClient()?.assignedAdvisor }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Strategic Commercial Information -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                            Información Comercial Estratégica
                        </h3>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-4 shadow-skandia-subtle">
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Saldo promedio mensual</p>
                                <p class="text-xl font-bold text-skandia-green body-1">{{ formatCurrency(selectedClient()?.averageMonthlyBalance) }}</p>
                            </div>
                            <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-4 shadow-skandia-subtle">
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Ticket promedio ingreso</p>
                                <p class="text-xl font-bold text-skandia-blue body-1">{{ formatCurrency(selectedClient()?.averageIncomeTicket) }}</p>
                            </div>
                            <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-4 shadow-skandia-subtle">
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Ticket promedio salida</p>
                                <p class="text-xl font-bold text-red-500 body-1">{{ formatCurrency(selectedClient()?.averageOutgoingTicket) }}</p>
                            </div>
                            <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-4 shadow-skandia-subtle">
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Número de operaciones</p>
                                <p class="text-xl font-bold text-skandia-gray dark:text-white body-1">{{ formatNumber(selectedClient()?.operationsCount) }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-4 shadow-skandia-subtle">
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Costo transaccional (6 meses)</p>
                                <p class="text-xl font-bold text-skandia-orange body-1">{{ formatCurrency(selectedClient()?.transactionalCost6Months) }}</p>
                            </div>
                            <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-4 shadow-skandia-subtle">
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Rentabilidad último día (EA)</p>
                                <p class="text-xl font-bold text-skandia-green body-1">{{ formatPercentage(selectedClient()?.lastDayProfitability) }}</p>
                            </div>
                            <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-4 shadow-skandia-subtle">
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Rentabilidad último mes (EA)</p>
                                <p class="text-xl font-bold text-skandia-green body-1">{{ formatPercentage(selectedClient()?.lastMonthProfitability) }}</p>
                            </div>
                            <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-4 shadow-skandia-subtle">
                                <p class="text-sm font-medium text-skandia-gray-4 dark:text-gray-300 mb-1 body-3">Rentabilidad acumulada (EA)</p>
                                <p class="text-xl font-bold text-skandia-green body-1">{{ formatPercentage(selectedClient()?.accumulatedProfitability) }}</p>
                            </div>
                        </div>

                        <!-- Collections and Withdrawals Cards -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 shadow-skandia-subtle border border-green-200 dark:border-green-700">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-green-700 dark:text-green-300 mb-1 body-3">Recaudos</p>
                                        <p class="text-2xl font-bold text-green-800 dark:text-green-200 body-1">{{ formatCurrency(selectedClient()?.collections) }}</p>
                                    </div>
                                    <div class="w-12 h-12 bg-green-200 dark:bg-green-700 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                                        <i class="pi pi-arrow-down text-2xl text-green-700 dark:text-green-300"></i>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-6 shadow-skandia-subtle border border-red-200 dark:border-red-700">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-red-700 dark:text-red-300 mb-1 body-3">Retiros</p>
                                        <p class="text-2xl font-bold text-red-800 dark:text-red-200 body-1">{{ formatCurrency(selectedClient()?.withdrawals) }}</p>
                                    </div>
                                    <div class="w-12 h-12 bg-red-200 dark:bg-red-700 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                                        <i class="pi pi-arrow-up text-2xl text-red-700 dark:text-red-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Flow Behavior Section -->
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                            Comportamiento del Flujo (Últimos 6 meses)
                        </h3>
                    </div>
                    <div class="p-6">
                        <!-- Chart -->
                        <div class="mb-6">
                            <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
                        </div>
                        
                        <!-- Detail Table -->
                        <p-table [value]="flowData" [tableStyle]="{'min-width': '50rem'}">
                            <ng-template #header>
                                <tr>
                                    <th class="text-skandia-gray dark:text-white body-3">Mes</th>
                                    <th class="text-skandia-gray dark:text-white body-3">Ingresos Totales</th>
                                    <th class="text-skandia-gray dark:text-white body-3">Salidas Totales</th>
                                    <th class="text-skandia-gray dark:text-white body-3">Neto Mensual</th>
                                    <th class="text-skandia-gray dark:text-white body-3">N° Mov. Ingreso</th>
                                    <th class="text-skandia-gray dark:text-white body-3">N° Mov. Salida</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-data>
                                <tr>
                                    <td class="text-skandia-gray dark:text-white body-2">{{ data.month }}</td>
                                    <td class="text-skandia-green font-medium body-2">{{ formatCurrency(data.income) }}</td>
                                    <td class="text-red-500 font-medium body-2">{{ formatCurrency(data.outgoing) }}</td>
                                    <td class="text-skandia-blue font-medium body-2">{{ formatCurrency(data.net) }}</td>
                                    <td class="text-skandia-gray dark:text-white body-2">{{ formatNumber(data.incomeMovements) }}</td>
                                    <td class="text-skandia-gray dark:text-white body-2">{{ formatNumber(data.outgoingMovements) }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </div>
                </div>
            </div>

            <!-- No Results Message -->
            <div *ngIf="searchPerformed() && !selectedClient()" class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                <div class="text-center">
                    <div class="w-16 h-16 bg-skandia-light-gray dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-skandia-subtle">
                        <i class="pi pi-search text-2xl text-skandia-gray-5 dark:text-gray-400"></i>
                    </div>
                    <h3 class="text-lg font-medium text-skandia-gray dark:text-white mb-2" style="font-family: var(--font-family-headings);">
                        No se encontraron resultados
                    </h3>
                    <p class="text-skandia-gray-5 dark:text-gray-400 body-2">
                        Verifique los criterios de búsqueda e intente nuevamente
                    </p>
                </div>
            </div>
        </div>
    `
})
export class MigoClients {
    searchCriteria = {
        name: '',
        documentNumber: '',
        contractNumber: ''
    };

    searching = signal(false);
    searchPerformed = signal(false);
    selectedClient = signal<Client | null>(null);

    // Mock data
    mockClient: Client = {
        id: '1',
        name: 'Corporación Andina S.A.',
        documentNumber: '900123456-7',
        contractNumber: 'CT-2024-001',
        status: 'Activo',
        documentType: 'NIT',
        connectionDate: new Date('2023-01-15'),
        connectionModel: 'API REST',
        clientType: 'Corporativo',
        productStatus: 'Activo',
        assignedAdvisor: 'María González',
        averageMonthlyBalance: 45000000,
        averageIncomeTicket: 2500000,
        averageOutgoingTicket: 1800000,
        operationsCount: 342,
        transactionalCost6Months: 850000,
        lastDayProfitability: 4.2,
        lastMonthProfitability: 3.8,
        accumulatedProfitability: 4.5,
        collections: 125000000,
        withdrawals: 98000000
    };

    flowData: FlowData[] = [
        { month: 'Enero', income: 125, outgoing: 98, net: 27, incomeMovements: 45, outgoingMovements: 32 },
        { month: 'Febrero', income: 142, outgoing: 105, net: 37, incomeMovements: 52, outgoingMovements: 38 },
        { month: 'Marzo', income: 138, outgoing: 112, net: 26, incomeMovements: 48, outgoingMovements: 41 },
        { month: 'Abril', income: 156, outgoing: 118, net: 38, incomeMovements: 58, outgoingMovements: 43 },
        { month: 'Mayo', income: 149, outgoing: 108, net: 41, incomeMovements: 55, outgoingMovements: 39 },
        { month: 'Junio', income: 162, outgoing: 125, net: 37, incomeMovements: 61, outgoingMovements: 47 }
    ];

    chartData: any;
    chartOptions: any;

    constructor() {
        this.initChart();
    }

    initChart() {
        this.chartData = {
            labels: this.flowData.map(d => d.month),
            datasets: [
                {
                    label: 'Ingresos',
                    backgroundColor: '#00C83C',
                    data: this.flowData.map(d => d.income)
                },
                {
                    label: 'Salidas',
                    backgroundColor: '#ef4444',
                    data: this.flowData.map(d => d.outgoing)
                },
                {
                    label: 'Neto',
                    backgroundColor: '#02B1FF',
                    data: this.flowData.map(d => d.net)
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: '#3F3F3F'
                    }
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

    searchClient() {
        this.searching.set(true);
        this.searchPerformed.set(false);
        
        // Simulate API call
        setTimeout(() => {
            if (this.searchCriteria.name || this.searchCriteria.documentNumber || this.searchCriteria.contractNumber) {
                this.selectedClient.set(this.mockClient);
            } else {
                this.selectedClient.set(null);
            }
            this.searching.set(false);
            this.searchPerformed.set(true);
        }, 1500);
    }

    clearSearch() {
        this.searchCriteria = {
            name: '',
            documentNumber: '',
            contractNumber: ''
        };
        this.selectedClient.set(null);
        this.searchPerformed.set(false);
    }

    formatDate(date: Date | undefined): string {
        if (!date) return '';
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    formatCurrency(value: number | undefined): string {
        if (!value) return '';
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatNumber(value: number | undefined): string {
        if (!value) return '';
        return new Intl.NumberFormat('es-ES').format(value);
    }

    formatPercentage(value: number | undefined): string {
        if (!value) return '';
        return `${value.toFixed(1)}%`;
    }
}