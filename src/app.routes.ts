import { Routes } from '@angular/router';
import { AuthGuard } from './app/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        loadChildren: () => import('./app/layout/component/app.layout').then(m => m.AppLayoutModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./app/pages/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'migo',
        canActivate: [AuthGuard],
        loadChildren: () => import('./app/layout/component/app.migo-layout').then(m => m.MigoLayoutModule)
    },
    {
        path: 'landing',
        loadComponent: () => import('./app/pages/landing/landing').then(m => m.LandingComponent)
    },
    {
        path: 'notfound',
        loadComponent: () => import('./app/pages/notfound/notfound').then(m => m.NotfoundComponent)
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
];