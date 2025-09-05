import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-migo-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMigoMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Principal',
                items: [
                    { 
                        label: 'Inicio', 
                        icon: 'pi pi-fw pi-home', 
                        routerLink: ['/'] 
                    }
                ]
            },
            {
                label: 'Gestión de Clientes',
                items: [
                    { 
                        label: 'Consulta de Clientes', 
                        icon: 'pi pi-fw pi-search', 
                        routerLink: ['/migo/clients'] 
                    },
                    { 
                        label: 'Perfilamiento de Cliente', 
                        icon: 'pi pi-fw pi-user-edit', 
                        routerLink: ['/migo/client-profiling'] 
                    }
                ]
            },
            {
                label: 'Servicios',
                items: [
                    { 
                        label: 'Dashboard de Servicio', 
                        icon: 'pi pi-fw pi-chart-bar', 
                        routerLink: ['/migo/service-dashboard'] 
                    },
                    { 
                        label: 'Bitácora de Implementación', 
                        icon: 'pi pi-fw pi-cog', 
                        routerLink: ['/migo/implementation-log'] 
                    },
                    { 
                        label: 'Bitácora de Implementación', 
                        icon: 'pi pi-fw pi-cog', 
                        routerLink: ['/migo/implementation-log'] 
                    }
                ]
            },
            {
                label: 'Usuario',
                items: [
                    { 
                        label: 'Perfil', 
                        icon: 'pi pi-fw pi-user', 
                        routerLink: ['/migo/profile'] 
                    }
                ]
            }
        ];
    }
}