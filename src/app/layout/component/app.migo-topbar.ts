import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-migo-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, ButtonModule, MenuModule],
    template: ` 
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo" routerLink="/">
                    <div class="w-12 h-12 bg-skandia-green rounded-lg flex items-center justify-center shadow-skandia-subtle">
                        <i class="pi pi-building text-2xl text-white"></i>
                    </div>
                    <span class="text-xl font-bold text-skandia-gray" style="font-family: var(--font-family-headings);">Portal MIGO</span>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                        <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                    </button>
                    <div class="relative">
                        <button
                            class="layout-topbar-action layout-topbar-action-highlight"
                            pStyleClass="@next"
                            enterFromClass="hidden"
                            enterActiveClass="animate-scalein"
                            leaveToClass="hidden"
                            leaveActiveClass="animate-fadeout"
                            [hideOnOutsideClick]="true"
                        >
                            <i class="pi pi-palette"></i>
                        </button>
                        <app-configurator />
                    </div>
                </div>

                <!-- User Menu -->
                <div class="relative">
                    <button 
                        class="layout-topbar-action flex items-center gap-2 px-3"
                        (click)="userMenu.toggle($event)"
                    >
                        <div class="w-8 h-8 bg-skandia-green rounded-full flex items-center justify-center shadow-skandia-subtle">
                            <span class="text-white text-sm font-medium">
                                {{ getUserInitials() }}
                            </span>
                        </div>
                        <span class="hidden lg:block text-sm font-medium text-skandia-gray">{{ currentUser()?.name }}</span>
                        <i class="pi pi-chevron-down text-xs"></i>
                    </button>
                    <p-menu #userMenu [popup]="true" [model]="userMenuItems" />
                </div>
            </div>
        </div>
    `
})
export class AppMigoTopbar {
    public layoutService = inject(LayoutService);
    private authService = inject(AuthService);

    currentUser = computed(() => this.authService.getCurrentUser()());

    userMenuItems: MenuItem[] = [
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            routerLink: ['/migo/profile']
        },
        {
            separator: true
        },
        {
            label: 'Cerrar Sesión',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
        }
    ];

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    getUserInitials(): string {
        const name = this.currentUser()?.name || '';
        const names = name.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    logout() {
        this.authService.logout();
    }
}