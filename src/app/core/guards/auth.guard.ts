import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getAccessToken();

  // ❌ Pas de token → pas connecté
  if (!token) {
    auth.logout();
    router.navigateByUrl('/login');
    return false;
  }

  // ❌ Token expiré → déconnexion propre
  if (auth.isTokenExpired()) {
    auth.logout();
    router.navigateByUrl('/login');
    return false;
  }

  // ✅ Token valide → accès autorisé
  return true;
};
