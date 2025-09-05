import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-migo-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div class="text-center">
                    <div class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="pi pi-user text-3xl text-indigo-600 dark:text-indigo-400"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Perfil de Usuario
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400 mb-8">
                        Gestión de información personal y configuración de cuenta
                    </p>
                    
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                        <div class="text-left space-y-4">
                            <div class="flex justify-between">
                                <span class="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                                <span class="text-gray-900 dark:text-white">{{ currentUser()?.name }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                                <span class="text-gray-900 dark:text-white">{{ currentUser()?.email }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium text-gray-700 dark:text-gray-300">Último acceso:</span>
                                <span class="text-gray-900 dark:text-white">{{ formatLastLogin() }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <p class="text-gray-500 dark:text-gray-400">
                            Configuraciones adicionales en desarrollo...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class MigoProfile {
    private authService = inject(AuthService);
    
    currentUser = computed(() => this.authService.getCurrentUser()());

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
}