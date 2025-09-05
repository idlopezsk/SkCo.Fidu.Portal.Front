import { Routes } from '@angular/router';
import { authGuard } from './app/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./app/layout/component/app.migo-layout').then(m => m.AppMigoLayout),
        canActivate: [authGuard],
        children: [
            { path: '', loadComponent: () => import('./app/pages/migo/home/home').then(m => m.MigoHome) },
            { path: 'clients', loadComponent: () => import('./app/pages/migo/clients/clients').then(m => m.MigoClients) },
            { path: 'service-dashboard', loadComponent: () => import('./app/pages/migo/service-dashboard/service-dashboard').then(m => m.ServiceDashboard) },
            { path: 'implementation-log', loadComponent: () => import('./app/pages/migo/implementation-log/implementation-log').then(m => m.ImplementationLog) },
            { path: 'client-profiling', loadComponent: () => import('./app/pages/migo/client-profiling/client-profiling').then(m => m.ClientProfiling) },
            { path: 'profile', loadComponent: () => import('./app/pages/migo/profile/profile').then(m => m.MigoProfile) }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./app/pages/auth/auth.routes')
    },
    {
        path: 'landing',
        loadComponent: () => import('./app/pages/landing/landing').then(m => m.Landing)
    },
    {
        path: 'pages',
        loadComponent: () => import('./app/layout/component/app.layout').then(m => m.AppLayout),
        children: [
            { path: '', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    {
        path: 'uikit',
        loadComponent: () => import('./app/layout/component/app.layout').then(m => m.AppLayout),
        children: [
            { path: '', loadChildren: () => import('./app/pages/uikit/uikit.routes') }
        ]
    },
    {
        path: 'documentation',
        loadComponent: () => import('./app/layout/component/app.layout').then(m => m.AppLayout),
        children: [
            { path: '', loadComponent: () => import('./app/pages/documentation/documentation').then(m => m.Documentation) }
        ]
    },
    {
        path: 'notfound',
        loadComponent: () => import('./app/pages/notfound/notfound').then(m => m.Notfound)
    },
    { path: '**', redirectTo: '/notfound' }
];