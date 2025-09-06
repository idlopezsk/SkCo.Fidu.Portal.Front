import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';

interface Activity {
    id: string;
    title: string;
    description: string;
    status: 'Pendiente' | 'En progreso' | 'Completada';
    assignedTo: string;
    dueDate: Date;
    progress: number;
}

interface Milestone {
    id: string;
    name: string;
    description: string;
    targetDate: Date;
    completedDate?: Date;
    status: 'Pendiente' | 'En progreso' | 'Completado';
    progress: number;
}

interface Incident {
    id: string;
    title: string;
    description: string;
    severity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
    status: 'Abierto' | 'En investigación' | 'Resuelto' | 'Cerrado';
    reportedDate: Date;
    resolvedDate?: Date;
}

@Component({
    selector: 'app-implementation-log',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        TableModule,
        TagModule,
        DialogModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        DatePickerModule,
        ProgressBarModule
    ],
    template: `
        <div class="space-y-6">
            <!-- Header -->
            <div class="bg-skandia-orange rounded-xl p-8 text-white shadow-skandia-medium">
                <h1 class="text-3xl font-bold mb-2" style="font-family: var(--font-family-headings);">
                    Bitácora de Implementación
                </h1>
                <p class="text-xl opacity-90 body-1">
                    Seguimiento de actividades, hitos e incidentes
                </p>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Actividades Activas</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                                {{ getActiveActivities() }}
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-blue-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-calendar text-lg lg:text-2xl text-skandia-blue dark:text-blue-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Hitos Completados</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-green" style="font-family: var(--font-family-headings);">
                                {{ getCompletedMilestones() }}
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-green-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-flag text-lg lg:text-2xl text-skandia-green dark:text-green-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Incidentes Abiertos</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-orange" style="font-family: var(--font-family-headings);">
                                {{ getOpenIncidents() }}
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-orange-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-exclamation-triangle text-lg lg:text-2xl text-skandia-orange dark:text-orange-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs lg:text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3 mb-1">Progreso General</p>
                            <p class="text-xl lg:text-3xl font-bold text-skandia-blue" style="font-family: var(--font-family-headings);">
                                {{ getOverallProgress() }}%
                            </p>
                        </div>
                        <div class="w-10 h-10 lg:w-12 lg:h-12 bg-skandia-light-gray dark:bg-purple-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-chart-pie text-lg lg:text-2xl text-skandia-blue dark:text-purple-400"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activities Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                        Actividades
                    </h3>
                    <button 
                        pButton 
                        type="button"
                        label="Nueva Actividad" 
                        icon="pi pi-plus"
                        class="bg-skandia-green hover:bg-green-600 text-white"
                        (click)="showActivityDialog = true"
                    />
                </div>
                <div class="p-6">
                    <p-table [value]="activities" [tableStyle]="{'min-width': '50rem'}">
                        <ng-template #header>
                            <tr>
                                <th class="text-skandia-gray dark:text-white body-3">Actividad</th>
                                <th class="text-skandia-gray dark:text-white body-3">Estado</th>
                                <th class="text-skandia-gray dark:text-white body-3">Asignado a</th>
                                <th class="text-skandia-gray dark:text-white body-3">Fecha Límite</th>
                                <th class="text-skandia-gray dark:text-white body-3">Progreso</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-activity>
                            <tr>
                                <td class="text-skandia-gray dark:text-white body-2">{{ activity.title }}</td>
                                <td>
                                    <p-tag 
                                        [value]="activity.status" 
                                        [severity]="getActivityStatusSeverity(activity.status)"
                                    />
                                </td>
                                <td class="text-skandia-gray dark:text-white body-2">{{ activity.assignedTo }}</td>
                                <td class="text-skandia-gray dark:text-white body-2">{{ formatDate(activity.dueDate) }}</td>
                                <td>
                                    <p-progressbar [value]="activity.progress" [showValue]="true" />
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>

            <!-- Activity Dialog -->
            <p-dialog 
                [(visible)]="showActivityDialog" 
                [modal]="true" 
                [style]="{'width': '450px'}" 
                header="Nueva Actividad"
            >
                <div class="space-y-4">
                    <div>
                        <label for="activityTitle" class="block text-sm font-medium text-skandia-gray dark:text-white mb-2 body-3">
                            Título
                        </label>
                        <input 
                            pInputText 
                            id="activityTitle" 
                            type="text" 
                            [(ngModel)]="newActivity.title"
                            class="w-full"
                        />
                    </div>
                    
                    <div>
                        <label for="activityDescription" class="block text-sm font-medium text-skandia-gray dark:text-white mb-2 body-3">
                            Descripción
                        </label>
                        <textarea 
                            pTextarea 
                            id="activityDescription" 
                            [(ngModel)]="newActivity.description"
                            rows="3"
                            class="w-full"
                        ></textarea>
                    </div>
                    
                    <div>
                        <label for="activityAssigned" class="block text-sm font-medium text-skandia-gray dark:text-white mb-2 body-3">
                            Asignado a
                        </label>
                        <input 
                            pInputText 
                            id="activityAssigned" 
                            type="text" 
                            [(ngModel)]="newActivity.assignedTo"
                            class="w-full"
                        />
                    </div>
                    
                    <div>
                        <label for="activityDueDate" class="block text-sm font-medium text-skandia-gray dark:text-white mb-2 body-3">
                            Fecha Límite
                        </label>
                        <p-datepicker 
                            id="activityDueDate"
                            [(ngModel)]="newActivity.dueDate"
                            [showIcon]="true"
                            class="w-full"
                        />
                    </div>
                </div>
                
                <ng-template #footer>
                    <div class="flex gap-2">
                        <button 
                            pButton 
                            type="button"
                            label="Cancelar" 
                            severity="secondary"
                            outlined
                            (click)="showActivityDialog = false"
                        />
                        <button 
                            pButton 
                            type="button"
                            label="Guardar" 
                            class="bg-skandia-green hover:bg-green-600 text-white"
                            (click)="saveActivity()"
                        />
                    </div>
                </ng-template>
            </p-dialog>
        </div>
    `
})
export class ImplementationLog {
    showActivityDialog = false;

    activities: Activity[] = [
        {
            id: '1',
            title: 'Configuración inicial del sistema',
            description: 'Configurar parámetros básicos del sistema',
            status: 'Completada',
            assignedTo: 'Juan Pérez',
            dueDate: new Date('2024-01-20'),
            progress: 100
        },
        {
            id: '2',
            title: 'Migración de datos',
            description: 'Migrar datos del sistema anterior',
            status: 'En progreso',
            assignedTo: 'María García',
            dueDate: new Date('2024-01-25'),
            progress: 65
        },
        {
            id: '3',
            title: 'Pruebas de integración',
            description: 'Ejecutar pruebas de integración con sistemas externos',
            status: 'Pendiente',
            assignedTo: 'Carlos López',
            dueDate: new Date('2024-01-30'),
            progress: 0
        }
    ];

    newActivity: Partial<Activity> = {
        title: '',
        description: '',
        assignedTo: '',
        dueDate: new Date(),
        status: 'Pendiente',
        progress: 0
    };

    getActiveActivities(): number {
        return this.activities.filter(a => a.status !== 'Completada').length;
    }

    getCompletedMilestones(): number {
        return this.activities.filter(a => a.status === 'Completada').length;
    }

    getOpenIncidents(): number {
        return 2; // Mock data
    }

    getOverallProgress(): number {
        const totalProgress = this.activities.reduce((sum, activity) => sum + activity.progress, 0);
        return Math.round(totalProgress / this.activities.length);
    }

    getActivityStatusSeverity(status: string): string {
        switch (status) {
            case 'Completada': return 'success';
            case 'En progreso': return 'info';
            case 'Pendiente': return 'warn';
            default: return 'secondary';
        }
    }

    saveActivity() {
        if (this.newActivity.title && this.newActivity.assignedTo) {
            const activity: Activity = {
                id: Date.now().toString(),
                title: this.newActivity.title,
                description: this.newActivity.description || '',
                status: 'Pendiente',
                assignedTo: this.newActivity.assignedTo,
                dueDate: this.newActivity.dueDate || new Date(),
                progress: 0
            };
            
            this.activities.push(activity);
            this.showActivityDialog = false;
            this.newActivity = {
                title: '',
                description: '',
                assignedTo: '',
                dueDate: new Date(),
                status: 'Pendiente',
                progress: 0
            };
        }
    }

    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }
}