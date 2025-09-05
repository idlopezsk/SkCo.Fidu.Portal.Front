import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-migo-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        RouterModule,
        RippleModule,
        AppFloatingConfigurator,
        MessageModule
    ],
    template: `
        <app-floating-configurator />
        <div class="bg-skandia-light-gray dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--color-skandia-green) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-white dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px; box-shadow: var(--shadow-medium);">
                        <div class="text-center mb-8">
                            <div class="w-20 h-20 bg-skandia-green rounded-full flex items-center justify-center mx-auto mb-6 shadow-skandia-medium">
                                <i class="pi pi-building text-3xl text-white"></i>
                            </div>
                            <div class="text-skandia-gray dark:text-surface-0 text-3xl font-bold mb-4" style="font-family: var(--font-family-headings);">Portal MIGO Fiduciaria</div>
                            <span class="text-skandia-gray-5 font-medium body-1">Ingrese sus credenciales para continuar</span>
                        </div>

                        <div class="space-y-6">
                            <div>
                                <label for="email1" class="block text-skandia-gray dark:text-surface-0 text-lg font-medium mb-2 body-2">Correo Electrónico</label>
                                <input 
                                    pInputText 
                                    id="email1" 
                                    type="email" 
                                    placeholder="usuario@migo.com" 
                                    class="w-full md:w-120 border-2 border-skandia-gray-9 focus:border-skandia-green rounded-lg p-3 body-1" 
                                    [(ngModel)]="email" 
                                />
                            </div>

                            <div>
                                <label for="password1" class="block text-skandia-gray dark:text-surface-0 font-medium text-lg mb-2 body-2">Contraseña</label>
                                <p-password 
                                    id="password1" 
                                    [(ngModel)]="password" 
                                    placeholder="Ingrese su contraseña" 
                                    [toggleMask]="true" 
                                    styleClass="w-full border-2 border-skandia-gray-9 focus:border-skandia-green rounded-lg" 
                                    [fluid]="true" 
                                    [feedback]="false"
                                />
                            </div>

                            <div *ngIf="errorMessage()" class="mb-4">
                                <p-message severity="error" [text]="errorMessage()" />
                            </div>

                            <div class="flex items-center justify-between mt-6 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="rememberMe" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1" class="text-skandia-gray dark:text-surface-0 body-2">Recordarme</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-skandia-blue hover:text-blue-600 body-2">¿Olvidó su contraseña?</span>
                            </div>
                            
                            <p-button 
                                label="Iniciar Sesión" 
                                styleClass="w-full bg-skandia-green hover:bg-green-600 border-0 text-white font-bold py-3 px-6 rounded-lg shadow-skandia-small transition-all duration-200"
                                [loading]="loading()"
                                (onClick)="login()"
                                style="font-family: var(--font-family-headings);"
                            />
                        </div>
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
    loading = signal(false);
    errorMessage = signal('');

    async login() {
        if (!this.email || !this.password) {
            this.errorMessage.set('Por favor ingrese correo y contraseña');
            return;
        }

        this.loading.set(true);
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
            this.loading.set(false);
        }
    }
}