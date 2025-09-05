import { Component, ElementRef } from '@angular/core';
import { AppMigoMenu } from './app.migo-menu';

@Component({
    selector: 'app-migo-sidebar',
    standalone: true,
    imports: [AppMigoMenu],
    template: ` 
        <div class="layout-sidebar">
            <app-migo-menu></app-migo-menu>
        </div>
    `
})
export class AppMigoSidebar {
    constructor(public el: ElementRef) {}
}