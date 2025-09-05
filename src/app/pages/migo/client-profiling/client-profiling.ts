import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-client-profiling',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div class="text-center">
                    <div class="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="pi pi-user-edit text-3xl text-purple-600 dark:text-purple-400"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Perfilamiento de Cliente
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 mb-8">
                        Herramientas para análisis y perfilamiento de clientes
                    </p>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <p class="text-gray-500 dark:text-gray-400">
                            Funcionalidad en desarrollo...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ClientProfiling {}