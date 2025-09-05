import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-migo-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-skandia-medium">
                <div class="text-center">
                    <div class="w-20 h-20 bg-skandia-light-gray dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-skandia-small">
                        <i class="pi pi-user text-3xl text-skandia-blue dark:text-indigo-400"></i>
                    </div>
                    <h1 class="text-3xl font-bold text-skandia-gray dark:text-white mb-4" style="font-family: var(--font-family-headings);">
                        Perfil de Usuario
                    </h1>
                    <p class="text-skandia-gray-5 dark:text-gray-400 mb-8 body-1">
                        Gestión de información personal y configuración de cuenta
                    </p>
                    
                    <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-6 mb-6 shadow-skandia-subtle">
                        <div class="text-left space-y-4">
                            <div class="flex justify-between">
                                <span class="font-medium text-skandia-gray-4 dark:text-gray-300 body-3">Nombre:</span>
                                <span class="text-skandia-gray dark:text-white body-2">{{ currentUser()?.name }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium text-skandia-gray-4 dark:text-gray-300 body-3">Email:</span>
                                <span class="text-skandia-gray dark:text-white body-2">{{ currentUser()?.email }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium text-skandia-gray-4 dark:text-gray-300 body-3">Último acceso:</span>
                                <span class="text-skandia-gray dark:text-white body-2">{{ formatLastLogin() }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-skandia-light-gray dark:bg-gray-700 rounded-lg p-6 shadow-skandia-subtle">
                        <p class="text-skandia-gray-5 dark:text-gray-400 body-2">
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