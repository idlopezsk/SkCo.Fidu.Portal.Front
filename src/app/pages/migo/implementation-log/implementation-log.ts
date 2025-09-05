import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { MessageModule } from 'primeng/message';

interface Activity {
    id: string;
    name: string;
    responsible: string;
    status: 'Nuevo' | 'Pendiente' | 'En progreso' | 'Finalizado';
    priority: 'Alta' | 'Media' | 'Baja';
    startDate: Date;
    estimatedEndDate: Date;
    description: string;
    conversations: Conversation[];
}

interface Milestone {
    id: string;
    name: string;
    responsible: string;
    status: 'Nuevo' | 'Pendiente' | 'En progreso' | 'Finalizado';
    priority: 'Alta' | 'Media' | 'Baja';
    startDate: Date;
    estimatedEndDate: Date;
    endDate?: Date;
    description: string;
}

interface Incident {
    id: string;
    name: string;
    responsible: string;
    status: 'Abierto' | 'En gestión' | 'Resuelto' | 'Finalizado';
    priority: 'Alta' | 'Media' | 'Baja';
    startDate: Date;
    estimatedEndDate: Date;
    endDate?: Date;
    description: string;
    conversations: Conversation[];
}

interface Conversation {
    id: string;
    author: string;
    message: string;
    timestamp: Date;
}

@Component({
    selector: 'app-implementation-log',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        DatePickerModule,
        TextareaModule,
        TagModule,
        TableModule,
        AccordionModule,
        MessageModule
    ],
    template: `
        <div class="space-y-6">
            <!-- Header -->
            <div class="bg-skandia-blue rounded-xl p-6 text-white shadow-skandia-medium">
                <h1 class="text-3xl font-bold mb-2" style="font-family: var(--font-family-headings);">
                    Bitácora de Implementación
                </h1>
                <p class="text-xl opacity-90 body-1">
                    Gestión de actividades, hitos e incidentes del proyecto
                </p>
            </div>

            <!-- Summary Dashboard -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3">Avance de Actividades</p>
                            <p class="text-3xl font-bold text-skandia-green" style="font-family: var(--font-family-headings);">
                                {{ getActivityProgress() }}%
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-skandia-light-gray dark:bg-green-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-chart-line text-2xl text-skandia-green dark:text-green-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3">Incidentes Abiertos</p>
                            <p class="text-3xl font-bold text-red-500" style="font-family: var(--font-family-headings);">
                                {{ getOpenIncidents() }}
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-skandia-light-gray dark:bg-red-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-exclamation-triangle text-2xl text-red-500 dark:text-red-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3">Hitos Completados</p>
                            <p class="text-3xl font-bold text-skandia-blue" style="font-family: var(--font-family-headings);">
                                {{ getCompletedMilestones() }}/{{ milestones().length }}
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-skandia-light-gray dark:bg-blue-900/30 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-flag text-2xl text-skandia-blue dark:text-blue-400"></i>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-skandia-small border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-skandia-gray-5 dark:text-gray-400 body-3">Total Actividades</p>
                            <p class="text-3xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                                {{ activities().length }}
                            </p>
                        </div>
                        <div class="w-12 h-12 bg-skandia-light-gray dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-skandia-subtle">
                            <i class="pi pi-list text-2xl text-skandia-gray dark:text-gray-400"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activities Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                        Actividades
                    </h3>
                    <p-button 
                        label="Nueva Actividad" 
                        icon="pi pi-plus"
                        (onClick)="showActivityDialog = true"
                        class="bg-skandia-green hover:bg-green-600"
                    />
                </div>
                <div class="p-6">
                    <p-table [value]="activities()" [tableStyle]="{'min-width': '50rem'}">
                        <ng-template #header>
                            <tr>
                                <th class="text-skandia-gray dark:text-white body-3">Actividad</th>
                                <th class="text-skandia-gray dark:text-white body-3">Responsable</th>
                                <th class="text-skandia-gray dark:text-white body-3">Estado</th>
                                <th class="text-skandia-gray dark:text-white body-3">Prioridad</th>
                                <th class="text-skandia-gray dark:text-white body-3">Fecha Estimada</th>
                                <th class="text-skandia-gray dark:text-white body-3">Acciones</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-activity>
                            <tr>
                                <td class="text-skandia-gray dark:text-white body-2">{{ activity.name }}</td>
                                <td class="text-skandia-gray dark:text-white body-2">{{ activity.responsible }}</td>
                                <td>
                                    <p-tag 
                                        [value]="activity.status" 
                                        [severity]="getStatusSeverity(activity.status)"
                                        class="shadow-skandia-subtle"
                                    />
                                </td>
                                <td>
                                    <p-tag 
                                        [value]="activity.priority" 
                                        [severity]="getPrioritySeverity(activity.priority)"
                                        class="shadow-skandia-subtle"
                                    />
                                </td>
                                <td class="text-skandia-gray dark:text-white body-2">{{ formatDate(activity.estimatedEndDate) }}</td>
                                <td>
                                    <div class="flex gap-2">
                                        <p-button 
                                            icon="pi pi-pencil" 
                                            (onClick)="editActivity(activity)"
                                            severity="secondary"
                                            [outlined]="true"
                                            size="small"
                                        />
                                        <p-button 
                                            icon="pi pi-comments" 
                                            (onClick)="toggleConversation(activity.id)"
                                            severity="info"
                                            [outlined]="true"
                                            size="small"
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr *ngIf="expandedConversations().includes(activity.id)">
                                <td colspan="6" class="p-0">
                                    <div class="bg-skandia-light-gray dark:bg-gray-700 p-4 m-4 rounded-lg shadow-skandia-subtle">
                                        <h5 class="font-medium text-skandia-gray dark:text-white mb-3 body-2">Conversación</h5>
                                        <div class="space-y-2 max-h-40 overflow-y-auto">
                                            <div *ngFor="let conv of activity.conversations" class="bg-white dark:bg-gray-600 p-3 rounded-lg shadow-skandia-subtle">
                                                <div class="flex justify-between items-start mb-1">
                                                    <span class="font-medium text-skandia-gray dark:text-white body-3">{{ conv.author }}</span>
                                                    <span class="text-skandia-gray-5 dark:text-gray-400 body-4">{{ formatDateTime(conv.timestamp) }}</span>
                                                </div>
                                                <p class="text-skandia-gray dark:text-white body-3">{{ conv.message }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>

            <!-- Milestones Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                        Hitos
                    </h3>
                    <p-button 
                        label="Nuevo Hito" 
                        icon="pi pi-flag"
                        (onClick)="showMilestoneDialog = true"
                        class="bg-skandia-blue hover:bg-blue-600"
                    />
                </div>
                <div class="p-6">
                    <p-table [value]="milestones()" [tableStyle]="{'min-width': '50rem'}">
                        <ng-template #header>
                            <tr>
                                <th class="text-skandia-gray dark:text-white body-3">Hito</th>
                                <th class="text-skandia-gray dark:text-white body-3">Responsable</th>
                                <th class="text-skandia-gray dark:text-white body-3">Estado</th>
                                <th class="text-skandia-gray dark:text-white body-3">Prioridad</th>
                                <th class="text-skandia-gray dark:text-white body-3">Fecha Estimada</th>
                                <th class="text-skandia-gray dark:text-white body-3">Acciones</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-milestone>
                            <tr>
                                <td class="text-skandia-gray dark:text-white body-2">{{ milestone.name }}</td>
                                <td class="text-skandia-gray dark:text-white body-2">{{ milestone.responsible }}</td>
                                <td>
                                    <p-tag 
                                        [value]="milestone.status" 
                                        [severity]="getStatusSeverity(milestone.status)"
                                        class="shadow-skandia-subtle"
                                    />
                                </td>
                                <td>
                                    <p-tag 
                                        [value]="milestone.priority" 
                                        [severity]="getPrioritySeverity(milestone.priority)"
                                        class="shadow-skandia-subtle"
                                    />
                                </td>
                                <td class="text-skandia-gray dark:text-white body-2">{{ formatDate(milestone.estimatedEndDate) }}</td>
                                <td>
                                    <p-button 
                                        icon="pi pi-pencil" 
                                        (onClick)="editMilestone(milestone)"
                                        severity="secondary"
                                        [outlined]="true"
                                        size="small"
                                    />
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>

            <!-- Incidents Section -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-skandia-small border border-gray-100 dark:border-gray-700">
                <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 class="text-xl font-bold text-skandia-gray dark:text-white" style="font-family: var(--font-family-headings);">
                        Incidentes
                    </h3>
                    <p-button 
                        label="Nuevo Incidente" 
                        icon="pi pi-exclamation-triangle"
                        (onClick)="showIncidentDialog = true"
                        class="bg-red-500 hover:bg-red-600"
                    />
                </div>
                <div class="p-6">
                    <p-table [value]="incidents()" [tableStyle]="{'min-width': '50rem'}">
                        <ng-template #header>
                            <tr>
                                <th class="text-skandia-gray dark:text-white body-3">Incidente</th>
                                <th class="text-skandia-gray dark:text-white body-3">Responsable</th>
                                <th class="text-skandia-gray dark:text-white body-3">Estado</th>
                                <th class="text-skandia-gray dark:text-white body-3">Prioridad</th>
                                <th class="text-skandia-gray dark:text-white body-3">Fecha Estimada</th>
                                <th class="text-skandia-gray dark:text-white body-3">Acciones</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-incident>
                            <tr>
                                <td class="text-skandia-gray dark:text-white body-2">{{ incident.name }}</td>
                                <td class="text-skandia-gray dark:text-white body-2">{{ incident.responsible }}</td>
                                <td>
                                    <p-tag 
                                        [value]="incident.status" 
                                        [severity]="getIncidentStatusSeverity(incident.status)"
                                        class="shadow-skandia-subtle"
                                    />
                                </td>
                                <td>
                                    <p-tag 
                                        [value]="incident.priority" 
                                        [severity]="getPrioritySeverity(incident.priority)"
                                        class="shadow-skandia-subtle"
                                    />
                                </td>
                                <td class="text-skandia-gray dark:text-white body-2">{{ formatDate(incident.estimatedEndDate) }}</td>
                                <td>
                                    <div class="flex gap-2">
                                        <p-button 
                                            icon="pi pi-pencil" 
                                            (onClick)="editIncident(incident)"
                                            severity="secondary"
                                            [outlined]="true"
                                            size="small"
                                        />
                                        <p-button 
                                            icon="pi pi-comments" 
                                            (onClick)="toggleIncidentConversation(incident.id)"
                                            severity="info"
                                            [outlined]="true"
                                            size="small"
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr *ngIf="expandedIncidentConversations().includes(incident.id)">
                                <td colspan="6" class="p-0">
                                    <div class="bg-skandia-light-gray dark:bg-gray-700 p-4 m-4 rounded-lg shadow-skandia-subtle">
                                        <h5 class="font-medium text-skandia-gray dark:text-white mb-3 body-2">Conversación del Incidente</h5>
                                        <div class="space-y-2 max-h-40 overflow-y-auto">
                                            <div *ngFor="let conv of incident.conversations" class="bg-white dark:bg-gray-600 p-3 rounded-lg shadow-skandia-subtle">
                                                <div class="flex justify-between items-start mb-1">
                                                    <span class="font-medium text-skandia-gray dark:text-white body-3">{{ conv.author }}</span>
                                                    <span class="text-skandia-gray-5 dark:text-gray-400 body-4">{{ formatDateTime(conv.timestamp) }}</span>
                                                </div>
                                                <p class="text-skandia-gray dark:text-white body-3">{{ conv.message }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>

        <!-- Activity Dialog -->
        <p-dialog 
            [(visible)]="showActivityDialog" 
            [modal]="true" 
            [style]="{width: '600px'}" 
            header="Nueva Actividad"
            [closable]="true"
        >
            <div class="space-y-4">
                <div>
                    <label for="activityName" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                        Nombre de la actividad
                    </label>
                    <input 
                        pInputText 
                        id="activityName" 
                        [(ngModel)]="newActivity.name"
                        class="w-full"
                        placeholder="Ingrese el nombre de la actividad"
                    />
                </div>

                <div>
                    <label for="activityResponsible" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                        Responsable
                    </label>
                    <input 
                        pInputText 
                        id="activityResponsible" 
                        [(ngModel)]="newActivity.responsible"
                        class="w-full"
                        placeholder="Ingrese el responsable"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="activityStatus" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Estado
                        </label>
                        <p-select 
                            [(ngModel)]="newActivity.status" 
                            [options]="statusOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Seleccione estado"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label for="activityPriority" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Prioridad
                        </label>
                        <p-select 
                            [(ngModel)]="newActivity.priority" 
                            [options]="priorityOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Seleccione prioridad"
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="activityStartDate" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Fecha de inicio
                        </label>
                        <p-datepicker 
                            [(ngModel)]="newActivity.startDate" 
                            [showIcon]="true"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label for="activityEndDate" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Fecha estimada de finalización
                        </label>
                        <p-datepicker 
                            [(ngModel)]="newActivity.estimatedEndDate" 
                            [showIcon]="true"
                            class="w-full"
                        />
                    </div>
                </div>

                <div>
                    <label for="activityDescription" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                        Descripción
                    </label>
                    <textarea 
                        pTextarea 
                        [(ngModel)]="newActivity.description"
                        rows="4"
                        class="w-full"
                        placeholder="Ingrese la descripción de la actividad"
                    ></textarea>
                </div>
            </div>

            <ng-template #footer>
                <div class="flex gap-2">
                    <p-button 
                        label="Cancelar" 
                        (onClick)="cancelActivityDialog()"
                        severity="secondary"
                        [outlined]="true"
                    />
                    <p-button 
                        label="Guardar Actividad" 
                        (onClick)="saveActivity()"
                        class="bg-skandia-green hover:bg-green-600"
                    />
                </div>
            </ng-template>
        </p-dialog>

        <!-- Milestone Dialog -->
        <p-dialog 
            [(visible)]="showMilestoneDialog" 
            [modal]="true" 
            [style]="{width: '600px'}" 
            header="Nuevo Hito"
            [closable]="true"
        >
            <div class="space-y-4">
                <div>
                    <label for="milestoneName" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                        Nombre del hito
                    </label>
                    <input 
                        pInputText 
                        id="milestoneName" 
                        [(ngModel)]="newMilestone.name"
                        class="w-full"
                        placeholder="Ingrese el nombre del hito"
                    />
                </div>

                <div>
                    <label for="milestoneResponsible" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                        Responsable
                    </label>
                    <input 
                        pInputText 
                        id="milestoneResponsible" 
                        [(ngModel)]="newMilestone.responsible"
                        class="w-full"
                        placeholder="Ingrese el responsable"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="milestoneStatus" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Estado
                        </label>
                        <p-select 
                            [(ngModel)]="newMilestone.status" 
                            [options]="statusOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Seleccione estado"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label for="milestonePriority" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Prioridad
                        </label>
                        <p-select 
                            [(ngModel)]="newMilestone.priority" 
                            [options]="priorityOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Seleccione prioridad"
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label for="milestoneStartDate" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Fecha de inicio
                        </label>
                        <p-datepicker 
                            [(ngModel)]="newMilestone.startDate" 
                            [showIcon]="true"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label for="milestoneEstimatedEndDate" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Fecha estimada
                        </label>
                        <p-datepicker 
                            [(ngModel)]="newMilestone.estimatedEndDate" 
                            [showIcon]="true"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label for="milestoneEndDate" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Fecha de finalización
                        </label>
                        <p-datepicker 
                            [(ngModel)]="newMilestone.endDate" 
                            [showIcon]="true"
                            class="w-full"
                        />
                    </div>
                </div>

                <div>
                    <label for="milestoneDescription" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                        Descripción
                    </label>
                    <textarea 
                        pTextarea 
                        [(ngModel)]="newMilestone.description"
                        rows="4"
                        class="w-full"
                        placeholder="Ingrese la descripción del hito"
                    ></textarea>
                </div>
            </div>

            <ng-template #footer>
                <div class="flex gap-2">
                    <p-button 
                        label="Cancelar" 
                        (onClick)="cancelMilestoneDialog()"
                        severity="secondary"
                        [outlined]="true"
                    />
                    <p-button 
                        label="Guardar Hito" 
                        (onClick)="saveMilestone()"
                        class="bg-skandia-blue hover:bg-blue-600"
                    />
                </div>
            </ng-template>
        </p-dialog>

        <!-- Incident Dialog -->
        <p-dialog 
            [(visible)]="showIncidentDialog" 
            [modal]="true" 
            [style]="{width: '600px'}" 
            header="Nuevo Incidente"
            [closable]="true"
        >
            <div class="space-y-4">
                <div>
                    <label for="incidentName" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                        Nombre del incidente
                    </label>
                    <input 
                        pInputText 
                        id="incidentName" 
                        [(ngModel)]="newIncident.name"
                        class="w-full"
                        placeholder="Ingrese el nombre del incidente"
                    />
                </div>

                <div>
                    <label for="incidentResponsible" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                        Responsable
                    </label>
                    <input 
                        pInputText 
                        id="incidentResponsible" 
                        [(ngModel)]="newIncident.responsible"
                        class="w-full"
                        placeholder="Ingrese el responsable"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="incidentStatus" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Estado
                        </label>
                        <p-select 
                            [(ngModel)]="newIncident.status" 
                            [options]="incidentStatusOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Seleccione estado"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label for="incidentPriority" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Prioridad
                        </label>
                        <p-select 
                            [(ngModel)]="newIncident.priority" 
                            [options]="priorityOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Seleccione prioridad"
                            class="w-full"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label for="incidentStartDate" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Fecha de inicio
                        </label>
                        <p-datepicker 
                            [(ngModel)]="newIncident.startDate" 
                            [showIcon]="true"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label for="incidentEstimatedEndDate" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Fecha estimada
                        </label>
                        <p-datepicker 
                            [(ngModel)]="newIncident.estimatedEndDate" 
                            [showIcon]="true"
                            class="w-full"
                        />
                    </div>
                    <div>
                        <label for="incidentEndDate" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                            Fecha de finalización
                        </label>
                        <p-datepicker 
                            [(ngModel)]="newIncident.endDate" 
                            [showIcon]="true"
                            class="w-full"
                        />
                    </div>
                </div>

                <div>
                    <label for="incidentDescription" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                        Descripción
                    </label>
                    <textarea 
                        pTextarea 
                        [(ngModel)]="newIncident.description"
                        rows="4"
                        class="w-full"
                        placeholder="Ingrese la descripción del incidente"
                    ></textarea>
                </div>
            </div>

            <ng-template #footer>
                <div class="flex gap-2">
                    <p-button 
                        label="Cancelar" 
                        (onClick)="cancelIncidentDialog()"
                        severity="secondary"
                        [outlined]="true"
                    />
                    <p-button 
                        label="Guardar Incidente" 
                        (onClick)="saveIncident()"
                        class="bg-red-500 hover:bg-red-600"
                    />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class ImplementationLog {
    showActivityDialog = false;
    showMilestoneDialog = false;
    showIncidentDialog = false;

    activities = signal<Activity[]>([
        {
            id: '1',
            name: 'Configuración inicial del sistema',
            responsible: 'Carlos Rodríguez',
            status: 'Finalizado',
            priority: 'Alta',
            startDate: new Date('2024-01-15'),
            estimatedEndDate: new Date('2024-01-30'),
            description: 'Configuración base del sistema MIGO',
            conversations: [
                {
                    id: '1',
                    author: 'Carlos Rodríguez',
                    message: 'Iniciando configuración del ambiente de desarrollo',
                    timestamp: new Date('2024-01-15T09:00:00')
                }
            ]
        },
        {
            id: '2',
            name: 'Integración con APIs externas',
            responsible: 'Ana Martínez',
            status: 'En progreso',
            priority: 'Alta',
            startDate: new Date('2024-02-01'),
            estimatedEndDate: new Date('2024-02-28'),
            description: 'Integración con servicios bancarios',
            conversations: []
        }
    ]);

    milestones = signal<Milestone[]>([
        {
            id: '1',
            name: 'Fase 1: Análisis y Diseño',
            responsible: 'Equipo Arquitectura',
            status: 'Finalizado',
            priority: 'Alta',
            startDate: new Date('2024-01-01'),
            estimatedEndDate: new Date('2024-01-31'),
            endDate: new Date('2024-01-28'),
            description: 'Análisis de requerimientos y diseño de la solución'
        },
        {
            id: '2',
            name: 'Fase 2: Desarrollo Core',
            responsible: 'Equipo Desarrollo',
            status: 'En progreso',
            priority: 'Alta',
            startDate: new Date('2024-02-01'),
            estimatedEndDate: new Date('2024-03-31'),
            description: 'Desarrollo de funcionalidades principales'
        }
    ]);

    incidents = signal<Incident[]>([
        {
            id: '1',
            name: 'Error en conexión con banco central',
            responsible: 'Soporte Técnico',
            status: 'En gestión',
            priority: 'Alta',
            startDate: new Date('2024-02-15'),
            estimatedEndDate: new Date('2024-02-20'),
            description: 'Intermitencia en la conexión con el banco central',
            conversations: [
                {
                    id: '1',
                    author: 'Soporte Técnico',
                    message: 'Se detectó intermitencia en la conexión. Investigando causa raíz.',
                    timestamp: new Date('2024-02-15T14:30:00')
                }
            ]
        }
    ]);

    expandedConversations = signal<string[]>([]);
    expandedIncidentConversations = signal<string[]>([]);

    newActivity: Partial<Activity> = {};
    newMilestone: Partial<Milestone> = {};
    newIncident: Partial<Incident> = {};

    statusOptions = [
        { label: 'Nuevo', value: 'Nuevo' },
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'En progreso', value: 'En progreso' },
        { label: 'Finalizado', value: 'Finalizado' }
    ];

    priorityOptions = [
        { label: 'Alta', value: 'Alta' },
        { label: 'Media', value: 'Media' },
        { label: 'Baja', value: 'Baja' }
    ];

    incidentStatusOptions = [
        { label: 'Abierto', value: 'Abierto' },
        { label: 'En gestión', value: 'En gestión' },
        { label: 'Resuelto', value: 'Resuelto' },
        { label: 'Finalizado', value: 'Finalizado' }
    ];

    getActivityProgress(): number {
        const total = this.activities().length;
        const completed = this.activities().filter(a => a.status === 'Finalizado').length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    getOpenIncidents(): number {
        return this.incidents().filter(i => i.status === 'Abierto' || i.status === 'En gestión').length;
    }

    getCompletedMilestones(): number {
        return this.milestones().filter(m => m.status === 'Finalizado').length;
    }

    toggleConversation(activityId: string) {
        const expanded = this.expandedConversations();
        if (expanded.includes(activityId)) {
            this.expandedConversations.set(expanded.filter(id => id !== activityId));
        } else {
            this.expandedConversations.set([...expanded, activityId]);
        }
    }

    toggleIncidentConversation(incidentId: string) {
        const expanded = this.expandedIncidentConversations();
        if (expanded.includes(incidentId)) {
            this.expandedIncidentConversations.set(expanded.filter(id => id !== incidentId));
        } else {
            this.expandedIncidentConversations.set([...expanded, incidentId]);
        }
    }

    editActivity(activity: Activity) {
        this.newActivity = { ...activity };
        this.showActivityDialog = true;
    }

    editMilestone(milestone: Milestone) {
        this.newMilestone = { ...milestone };
        this.showMilestoneDialog = true;
    }

    editIncident(incident: Incident) {
        this.newIncident = { ...incident };
        this.showIncidentDialog = true;
    }

    saveActivity() {
        if (this.newActivity.id) {
            // Update existing activity
            const activities = this.activities();
            const index = activities.findIndex(a => a.id === this.newActivity.id);
            if (index !== -1) {
                activities[index] = { ...this.newActivity } as Activity;
                this.activities.set([...activities]);
            }
        } else {
            // Create new activity
            const newActivity: Activity = {
                ...this.newActivity,
                id: Date.now().toString(),
                conversations: []
            } as Activity;
            this.activities.set([...this.activities(), newActivity]);
        }
        this.cancelActivityDialog();
    }

    saveMilestone() {
        if (this.newMilestone.id) {
            // Update existing milestone
            const milestones = this.milestones();
            const index = milestones.findIndex(m => m.id === this.newMilestone.id);
            if (index !== -1) {
                milestones[index] = { ...this.newMilestone } as Milestone;
                this.milestones.set([...milestones]);
            }
        } else {
            // Create new milestone
            const newMilestone: Milestone = {
                ...this.newMilestone,
                id: Date.now().toString()
            } as Milestone;
            this.milestones.set([...this.milestones(), newMilestone]);
        }
        this.cancelMilestoneDialog();
    }

    saveIncident() {
        if (this.newIncident.id) {
            // Update existing incident
            const incidents = this.incidents();
            const index = incidents.findIndex(i => i.id === this.newIncident.id);
            if (index !== -1) {
                incidents[index] = { ...this.newIncident } as Incident;
                this.incidents.set([...incidents]);
            }
        } else {
            // Create new incident
            const newIncident: Incident = {
                ...this.newIncident,
                id: Date.now().toString(),
                conversations: []
            } as Incident;
            this.incidents.set([...this.incidents(), newIncident]);
        }
        this.cancelIncidentDialog();
    }

    cancelActivityDialog() {
        this.showActivityDialog = false;
        this.newActivity = {};
    }

    cancelMilestoneDialog() {
        this.showMilestoneDialog = false;
        this.newMilestone = {};
    }

    cancelIncidentDialog() {
        this.showIncidentDialog = false;
        this.newIncident = {};
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'Finalizado': return 'success';
            case 'En progreso': return 'info';
            case 'Pendiente': return 'warn';
            case 'Nuevo': return 'secondary';
            default: return 'secondary';
        }
    }

    getIncidentStatusSeverity(status: string): string {
        switch (status) {
            case 'Finalizado': 
            case 'Resuelto': return 'success';
            case 'En gestión': return 'info';
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

    formatDate(date: Date | undefined): string {
        if (!date) return '';
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }

    formatDateTime(date: Date): string {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
}