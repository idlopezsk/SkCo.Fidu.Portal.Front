@@ .. @@
import { Routes } from '@angular/router';
import { AppMigoLayout } from './app/layout/component/app.migo-layout';
import { MigoHome } from './app/pages/migo/home/home';
import { MigoClients } from './app/pages/migo/clients/clients';
import { ServiceDashboard } from './app/pages/migo/service-dashboard/service-dashboard';
import { ClientProfiling } from './app/pages/migo/client-profiling/client-profiling';
import { MigoProfile } from './app/pages/migo/profile/profile';
+import { ImplementationLog } from './app/pages/migo/implementation-log/implementation-log';
import { MigoLogin } from './app/pages/auth/migo-login';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppMigoLayout,
        canActivate: [authGuard],
        children: [
            { path: '', component: MigoHome },
            { path: 'migo/clients', component: MigoClients },
            { path: 'migo/service-dashboard', component: ServiceDashboard },
            { path: 'migo/client-profiling', component: ClientProfiling },
+            { path: 'migo/implementation-log', component: ImplementationLog },
            { path: 'migo/profile', component: MigoProfile }
        ]
    },
    { path: 'auth/login', component: MigoLogin },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];