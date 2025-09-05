import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-migo-clients',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-skandia-medium">
                <div class="text-center">
                    <div class="w-20 h-20 bg-skandia-light-gray dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-skandia-small">
                        <i class="pi pi-search text-3xl text-skandia-blue dark:text-blue-400"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-skandia-gray dark:text-white mb-4" style="font-family: var(--font-family-headings);">
                        Consulta de Clientes
                    </h1>
                    <p class="text-skandia-gray-5 dark:text-gray-400 mb-8 body-1">
                        Módulo para búsqueda y consulta de información de clientes
                    </p>
                    <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-6 shadow-skandia-subtle">
                        <p class="text-skandia-gray-5 dark:text-gray-400 body-2">
                            Funcionalidad en desarrollo...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class MigoClients {}