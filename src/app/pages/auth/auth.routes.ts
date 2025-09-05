import { Routes } from '@angular/router';

export default [
    {
        path: 'login',
        loadComponent: () => import('./login').then(m => m.Login)
    },
    {
        path: 'migo-login',
        loadComponent: () => import('./migo-login').then(m => m.MigoLogin)
    },
    {
        path: 'access',
        loadComponent: () => import('./access').then(m => m.Access)
    },
    {
        path: 'error',
        loadComponent: () => import('./error').then(m => m.Error)
    },
    {
        path: '',
        redirectTo: 'migo-login',
        pathMatch: 'full'
    }
] as Routes;