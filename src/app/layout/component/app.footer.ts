import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Portal MIGO Fiduciaria © {{ currentYear }} - 
        <span class="text-primary font-bold">Sistema de Gestión Integral</span>
    </div>`
})
export class AppFooter {
    currentYear = new Date().getFullYear();
}
