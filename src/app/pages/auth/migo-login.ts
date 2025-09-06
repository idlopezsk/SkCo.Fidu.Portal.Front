import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-migo-login',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule, 
        CheckboxModule, 
        InputTextModule, 
        PasswordModule, 
        FormsModule, 
        RouterModule, 
        RippleModule, 
        AppFloatingConfigurator,
        MessageModule
    ],
    template: `
        <app-floating-configurator />
        <div class="bg-skandia-light-gray dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div class="w-full max-w-md bg-white dark:bg-surface-900 py-12 px-8 rounded-2xl shadow-skandia-medium border border-gray-100 dark:border-gray-700">
                    <div class="text-center mb-8">
                        <!-- MIGO Logo -->
                        <div class="w-16 h-16 bg-skandia-green rounded-xl flex items-center justify-center mx-auto mb-6 shadow-skandia-small">
                            <i class="pi pi-building text-3xl text-white"></i>
                        </div>
                        <div class="text-skandia-gray dark:text-surface-0 text-3xl font-bold mb-2" [ngStyle]="{'font-family': 'var(--font-family-headings)'}">
                            Portal MIGO
                        </div>
                        <span class="text-skandia-gray-5 dark:text-surface-400 font-medium body-2">
                            Sistema de Gestión Integral
                        </span>
                    </div>

                    <form class="space-y-6">
                        <div>
                            <label for="email" class="block text-skandia-gray dark:text-surface-0 text-sm font-medium mb-2 body-3">
                                Correo Electrónico
                            </label>
                            <input 
                                pInputText 
                                id="email" 
                                type="email" 
                                placeholder="usuario@migo.com" 
                                class="w-full" 
                                [(ngModel)]="email"
                                name="email"
                            />
                        </div>

                        <div>
                            <label for="password" class="block text-skandia-gray dark:text-surface-0 font-medium text-sm mb-2 body-3">
                                Contraseña
                            </label>
                            <p-password 
                                id="password" 
                                [(ngModel)]="password" 
                                placeholder="Contraseña" 
                                [toggleMask]="true" 
                                styleClass="w-full" 
                                [fluid]="true" 
                                [feedback]="false"
                                name="password"
                            />
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <p-checkbox 
                                    [(ngModel)]="rememberMe" 
                                    id="rememberme" 
                                    binary 
                                    class="mr-2"
                                    name="rememberme"
                                />
                                <label for="rememberme" class="text-skandia-gray dark:text-surface-0 body-3">
                                    Recordarme
                                </label>
                            </div>
                            <span class="font-medium no-underline cursor-pointer text-skandia-blue hover:text-blue-600 body-3">
                                ¿Olvidaste tu contraseña?
                            </span>
                        </div>

                        <div *ngIf="errorMessage()" class="mb-4">
                            <p-message severity="error" [text]="errorMessage()" />
                        </div>

                        <button 
                            type="button"
                            pButton 
                            pRipple
                            [loading]="isLoading()"
                            (click)="login()"
                            class="w-full bg-skandia-green hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-skandia-small"
                            [ngStyle]="{'font-family': 'var(--font-family-headings)'}"
                        >
                            <span *ngIf="!isLoading()">Iniciar Sesión</span>
                            <span *ngIf="isLoading()">Iniciando...</span>
                        </button>
                    </form>

                    <div class="mt-8 text-center">
                        <p class="text-skandia-gray-5 dark:text-surface-400 body-4">
                            Portal MIGO Fiduciaria © {{ currentYear }} - Sistema de Gestión Integral
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class MigoLogin {
    private authService = inject(AuthService);
    private router = inject(Router);

    email: string = '';
    password: string = '';
    rememberMe: boolean = false;
    isLoading = signal(false);
    errorMessage = signal('');
    currentYear = new Date().getFullYear();

    async login() {
        if (!this.email || !this.password) {
            this.errorMessage.set('Por favor ingrese email y contraseña');
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        try {
            const success = await this.authService.login(this.email, this.password);
            if (success) {
                this.router.navigate(['/']);
            } else {
                this.errorMessage.set('Credenciales incorrectas. Intente nuevamente.');
            }
        } catch (error) {
            this.errorMessage.set('Error al iniciar sesión. Intente nuevamente.');
        } finally {
            this.isLoading.set(false);
        }
    }
}