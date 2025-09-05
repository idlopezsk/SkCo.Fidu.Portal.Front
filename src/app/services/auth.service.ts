import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
    id: string;
    name: string;
    email: string;
    lastLogin?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser = signal<User | null>(null);
    private isAuthenticated = signal<boolean>(false);

    constructor(private router: Router) {
        // Check if user is already logged in
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser.set(JSON.parse(savedUser));
            this.isAuthenticated.set(true);
        }
    }

    getCurrentUser() {
        return this.currentUser.asReadonly();
    }

    getIsAuthenticated() {
        return this.isAuthenticated.asReadonly();
    }

    login(email: string, password: string): Promise<boolean> {
        return new Promise((resolve) => {
            // Simulate API call
            setTimeout(() => {
                if (email === 'admin@migo.com' && password === 'admin123') {
                    const user: User = {
                        id: '1',
                        name: 'Juan Carlos Pérez',
                        email: email,
                        lastLogin: new Date()
                    };
                    
                    this.currentUser.set(user);
                    this.isAuthenticated.set(true);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 1000);
        });
    }

    logout() {
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
        localStorage.removeItem('currentUser');
        this.router.navigate(['/auth/login']);
    }

    resetPassword(email: string): Promise<boolean> {
        return new Promise((resolve) => {
            // Simulate API call
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }
}