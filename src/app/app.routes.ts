import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Clients } from './features/clients/clients';
import { Commandes } from './features/commandes/commandes';

import { ClientsAdd } from './features/clients-add/clients-add';
import { ClientsEdit } from './features/clients-edit/clients-edit';
import { CommandesAdd } from './features/commandes-add/commande-add';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { CommandesEdit } from './features/commandes-edit/commandes-edit';

export const routes: Routes = [
  // Public
  { path: 'login', component: Login },

  // Auth (USER + ADMIN)
  { path: 'clients', component: Clients, canActivate: [authGuard] },
  { path: 'commandes', component: Commandes, canActivate: [authGuard] },

  // Admin only
  { path: 'clients/add', component: ClientsAdd, canActivate: [adminGuard] },
  { path: 'clients/:id/edit', component: ClientsEdit, canActivate: [adminGuard] },
  { path: 'commandes/add', component: CommandesAdd, canActivate: [adminGuard] },
  { path: 'commandes/:id/edit', component: CommandesEdit, canActivate: [adminGuard] },

  // Default + fallback
  { path: '', redirectTo: 'clients', pathMatch: 'full' },
  { path: '**', redirectTo: 'clients' }
];
