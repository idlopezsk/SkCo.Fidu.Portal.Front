import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

interface Client {
    id: string;
    name: string;
    document: string;
    contract: string;
    status: 'Activo' | 'Inactivo' | 'Suspendido';
    balance: number;
    lastActivity: Date;
}

@Component({
    selector: 'app-migo-clients',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        SelectModule,
        CardModule,
        TagModule,
        TableModule,
        ChartModule
    ],
    template: `
        <div class="space-y-6">
            <!-- Header -->
            <div class="bg-skandia-blue rounded-xl p-8 text-white shadow-skandia-medium">
                <h1 class="text-3xl font-bold mb-2" style="font-family: var(--font-family-headings);">
                    Consulta de Cliente
                </h1>
                <p class="text-xl opacity-90 body-1">
                    Búsqueda y gestión de información de clientes
                </p>
            </div>

            <!-- Search Form -->
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                <h3 class="text-xl font-bold text-skandia-gray dark:text-white mb-6" style="font-family: var(--font-family-headings);">
                    Búsqueda de Cliente
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label for="clientName" class="block text-sm font-medium text-skandia-gray dark:text-white mb-2 body-3">
                            Nombre del Cliente
                        </label>
                        <input 
                            pInputText 
                            id="clientName" 
                            type="text" 
                            placeholder="Ingrese nombre del cliente"
                            [(ngModel)]="searchForm.name"
                            class="w-full"
                        />
                    </div>
                    
                    <div>
                        <label for="clientDocument" class="block text-sm font-medium text-skandia-gray dark:text-white mb-2 body-3">
                            Número de Documento
                        </label>
                        <input 
                            pInputText 
                            id="clientDocument" 
                            type="text" 
                            placeholder="Ingrese número de documento"
                            [(ngModel)]="searchForm.document"
                            class="w-full"
                        />
                    </div>
                    
                    <div>
                        <label for="clientContract" class="block text-sm font-medium text-skandia-gray dark:text-white mb-2 body-3">
                            Número de Contrato
                        </label>
                        <input 
                            pInputText 
                            id="clientContract" 
                            type="text" 
                            placeholder="Ingrese número de contrato"
                            [(ngModel)]="searchForm.contract"
                            class="w-full"
                        />
                    </div>
                </div>
                
                <div class="flex gap-3">
                    <button 
                        pButton 
                        type="button"
                        label="Buscar Cliente" 
                        icon="pi pi-search"
                        class="bg-skandia-green hover:bg-green-600 text-white"
                        (click)="searchClient()"
                    />
                    <button 
                        pButton 
                        type="button"
                        label="Limpiar" 
                        icon="pi pi-trash"
                        severity="secondary"
                        outlined
                        (click)="clearSearch()"
                    />
                </div>
            </div>

            <!-- Client Information -->
            <div *ngIf="selectedClient" class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                        Información del Cliente
                    </h3>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Client Summary -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <h4 class="text-lg font-semibold text-skandia-gray dark:text-white">{{ selectedClient.name }}</h4>
                                <p-tag 
                                    [value]="selectedClient.status" 
                                    [severity]="getStatusSeverity(selectedClient.status)"
                                />
                            </div>
                            
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-skandia-gray-5 dark:text-gray-400 body-3">Documento:</span>
                                    <span class="text-skandia-gray dark:text-white body-2">{{ selectedClient.document }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-skandia-gray-5 dark:text-gray-400 body-3">Contrato:</span>
                                    <span class="text-skandia-gray dark:text-white body-2">{{ selectedClient.contract }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-skandia-gray-5 dark:text-gray-400 body-3">Saldo:</span>
                                    <span class="text-skandia-green font-bold body-2">{{ formatCurrency(selectedClient.balance) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-skandia-gray-5 dark:text-gray-400 body-3">Última Actividad:</span>
                                    <span class="text-skandia-gray dark:text-white body-2">{{ formatDate(selectedClient.lastActivity) }}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Quick Actions -->
                        <div class="space-y-4">
                            <h4 class="text-lg font-semibold text-skandia-gray dark:text-white">Acciones Rápidas</h4>
                            <div class="grid grid-cols-2 gap-3">
                                <button 
                                    pButton 
                                    type="button"
                                    label="Ver Movimientos" 
                                    icon="pi pi-list"
                                    severity="secondary"
                                    outlined
                                    class="w-full"
                                />
                                <button 
                                    pButton 
                                    type="button"
                                    label="Generar Reporte" 
                                    icon="pi pi-file-pdf"
                                    severity="secondary"
                                    outlined
                                    class="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Results -->
            <div *ngIf="searchPerformed && !selectedClient" class="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-skandia-small border border-gray-100 dark:border-gray-700">
                <div class="w-16 h-16 bg-skandia-light-gray dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="pi pi-search text-2xl text-skandia-gray-5 dark:text-gray-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-skandia-gray dark:text-white mb-2">No se encontraron resultados</h3>
                <p class="text-skandia-gray-5 dark:text-gray-400 body-2">
                    Verifique los criterios de búsqueda e intente nuevamente
                </p>
            </div>
        </div>
    `
})
export class MigoClients {
    searchForm = {
        name: '',
        document: '',
        contract: ''
    };

    selectedClient: Client | null = null;
    searchPerformed = false;

    // Mock client data
    private mockClients: Client[] = [
        {
            id: '1',
            name: 'Corporación Andina S.A.',
            document: '900123456-7',
            contract: 'CT-2024-001',
            status: 'Activo',
            balance: 45000000,
            lastActivity: new Date('2024-01-15')
        },
        {
            id: '2',
            name: 'Inversiones del Pacífico Ltda.',
            document: '800987654-3',
            contract: 'CT-2024-002',
            status: 'Activo',
            balance: 38500000,
            lastActivity: new Date('2024-01-12')
        }
    ];

    searchClient() {
        this.searchPerformed = true;
        
        // Simple search simulation
        if (this.searchForm.name || this.searchForm.document || this.searchForm.contract) {
            this.selectedClient = this.mockClients.find(client => 
                client.name.toLowerCase().includes(this.searchForm.name.toLowerCase()) ||
                client.document.includes(this.searchForm.document) ||
                client.contract.includes(this.searchForm.contract)
            ) || null;
        } else {
            this.selectedClient = null;
        }
    }

    clearSearch() {
        this.searchForm = {
            name: '',
            document: '',
            contract: ''
        };
        this.selectedClient = null;
        this.searchPerformed = false;
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'Activo': return 'success';
            case 'Inactivo': return 'warn';
            case 'Suspendido': return 'danger';
            default: return 'secondary';
        }
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }
}