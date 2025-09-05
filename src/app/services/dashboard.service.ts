import { Injectable } from '@angular/core';

export interface ClientMetrics {
    totalClients: number;
    activeClients: number;
    totalAssets: number;
    implementationClients: number;
}

export interface TopClient {
    name: string;
    balance: number;
    operations?: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    getClientMetrics(): ClientMetrics {
        return {
            totalClients: 1247,
            activeClients: 1156,
            totalAssets: 2847500000,
            implementationClients: 23
        };
    }

    getTopClientsByBalance(): TopClient[] {
        return [
            { name: 'Corporación Andina S.A.', balance: 45000000 },
            { name: 'Inversiones del Pacífico Ltda.', balance: 38500000 },
            { name: 'Grupo Empresarial Norte', balance: 32100000 },
            { name: 'Fundación Esperanza', balance: 28750000 },
            { name: 'Comercializadora Sur S.A.S.', balance: 24300000 }
        ];
    }

    getTopClientsByTransactions(): TopClient[] {
        return [
            { name: 'Banco Regional', balance: 15600000, operations: 342 },
            { name: 'Cooperativa Central', balance: 12400000, operations: 298 },
            { name: 'Financiera Popular', balance: 18900000, operations: 267 },
            { name: 'Caja de Compensación', balance: 9800000, operations: 234 },
            { name: 'Fondo de Empleados', balance: 7200000, operations: 189 }
        ];
    }
}