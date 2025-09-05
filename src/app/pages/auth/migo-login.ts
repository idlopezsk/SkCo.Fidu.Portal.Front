import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-migo-login',
    standalone: true,
    imports: [
        ButtonModule, 
        CheckboxModule, 
        InputTextModule, 
        PasswordModule, 
        FormsModule, 
        RouterModule, 
        MessageModule,
        CommonModule
    ],
    template: `
        <div class="min-h-screen flex items-center justify-center bg-skandia-light-gray dark:from-gray-900 dark:to-gray-800">
            <div class="w-full max-w-md">
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-skandia-medium p-8">
                    <!-- Logo and Header -->
                    <div class="text-center mb-8">
                        <div class="w-20 h-20 bg-skandia-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-skandia-small">
                            <i class="pi pi-building text-3xl text-white"></i>
                        </div>
                        <h1 class="text-3xl font-bold text-skandia-gray dark:text-white mb-2" style="font-family: var(--font-family-headings);">Portal MIGO</h1>
                        <h2 class="text-xl text-skandia-gray dark:text-gray-300" style="font-family: var(--font-family-headings);">Fiduciaria</h2>
                        <p class="text-skandia-gray-5 dark:text-gray-400 mt-2 body-2">Bienvenido al sistema de gestión</p>
                    </div>

                    <!-- Error Message -->
                    <div *ngIf="errorMessage()" class="mb-4">
                        <p-message severity="error" [text]="errorMessage()" />
                    </div>

                    <!-- Login Form -->
                    <form (ngSubmit)="onLogin()" class="space-y-6">
                        <div>
                            <label for="email" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                                Correo Electrónico
                            </label>
                            <input 
                                pInputText 
                                id="email" 
                                type="email" 
                                [(ngModel)]="email" 
                                name="email"
                                placeholder="usuario@migo.com"
                                class="w-full"
                                required
                            />
                        </div>

                        <div>
                            <label for="password" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                                Contraseña
                            </label>
                            <p-password 
                                id="password" 
                                [(ngModel)]="password" 
                                name="password"
                                placeholder="Ingrese su contraseña" 
                                [toggleMask]="true" 
                                [fluid]="true" 
                                [feedback]="false"
                                required
                            />
                        </div>

                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <p-checkbox 
                                    [(ngModel)]="rememberMe" 
                                    id="remember" 
                                    name="remember"
                                    binary 
                                    class="mr-2"
                                />
                                <label for="remember" class="text-sm text-skandia-gray-5 dark:text-gray-400 body-3">
                                    Recordarme
                                </label>
                            </div>
                            <button 
                                type="button" 
                                (click)="showResetPassword = true"
                                class="text-sm text-skandia-blue hover:text-skandia-blue font-medium body-3"
                            >
                                ¿Olvidó su contraseña?
                            </button>
                        </div>

                        <p-button 
                            type="submit"
                            label="Iniciar Sesión" 
                            [loading]="loading()"
                            [fluid]="true"
                            class="w-full"
                        />
                    </form>

                    <!-- Reset Password Section -->
                    <div *ngIf="showResetPassword" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <h3 class="text-lg font-medium text-skandia-gray dark:text-white mb-4" style="font-family: var(--font-family-headings);">
                            Restablecer Contraseña
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label for="resetEmail" class="block text-sm font-medium text-skandia-gray dark:text-gray-300 mb-2 body-3">
                                    Correo Electrónico
                                </label>
                                <input 
                                    pInputText 
                                    id="resetEmail" 
                                    type="email" 
                                    [(ngModel)]="resetEmail"
                                    placeholder="usuario@migo.com"
                                    class="w-full"
                                />
                            </div>
                            <div class="flex gap-2">
                                <p-button 
                                    label="Enviar" 
                                    (onClick)="onResetPassword()"
                                    [loading]="resetLoading()"
                                    severity="secondary"
                                    [fluid]="true"
                                />
                                <p-button 
                                    label="Cancelar" 
                                    (onClick)="showResetPassword = false"
                                    severity="secondary"
                                    [outlined]="true"
                                    [fluid]="true"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Success Message for Reset -->
                    <div *ngIf="resetSuccess()" class="mt-4">
                        <p-message 
                            severity="success" 
                            text="Se ha enviado un enlace de restablecimiento a su correo electrónico" 
                        />
                    </div>

                    <!-- Demo Credentials -->
                    <div class="mt-6 p-4 bg-skandia-light-gray dark:bg-blue-900/20 rounded-lg shadow-skandia-subtle">
                        <p class="text-sm text-skandia-gray dark:text-blue-200 font-medium mb-2 body-3">Credenciales de prueba:</p>
                        <p class="text-sm text-skandia-gray-4 dark:text-blue-300 body-4">
                            Email: admin@migo.com<br>
                            Contraseña: admin123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class MigoLogin {
    email: string = '';
    password: string = '';
    rememberMe: boolean = false;
    resetEmail: string = '';
    showResetPassword: boolean = false;
    
    loading = signal(false);
    resetLoading = signal(false);
    errorMessage = signal('');
    resetSuccess = signal(false);

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    async onLogin() {
        if (!this.email || !this.password) {
            this.errorMessage.set('Por favor complete todos los campos');
            return;
        }

        this.loading.set(true);
        this.errorMessage.set('');

        try {
            const success = await this.authService.login(this.email, this.password);
            if (success) {
                this.router.navigate(['/']);
            } else {
                this.errorMessage.set('Credenciales incorrectas. Verifique su email y contraseña.');
            }
        } catch (error) {
            this.errorMessage.set('Error al iniciar sesión. Intente nuevamente.');
        } finally {
            this.loading.set(false);
        }
    }

    async onResetPassword() {
        if (!this.resetEmail) {
            return;
        }

        this.resetLoading.set(true);
        this.resetSuccess.set(false);

        try {
            await this.authService.resetPassword(this.resetEmail);
            this.resetSuccess.set(true);
            this.showResetPassword = false;
            this.resetEmail = '';
        } catch (error) {
            // Handle error
        } finally {
            this.resetLoading.set(false);
        }
    }
}