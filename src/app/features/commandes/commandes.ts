import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { catchError, finalize, timeout } from 'rxjs/operators';

import { CommandeService } from '../../services/commandes.service';
import { Commande } from '../../models/commande.model';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './commandes.html',
  styleUrls: ['./commandes.css']
})
export class Commandes implements OnInit {

  commandes: Commande[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  isAdmin: boolean = false;

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadCommandes();
  }

  loadCommandes(): void {
    this.loading = true;
    this.errorMessage = '';

    this.commandeService.getCommandes()
      .pipe(
        timeout(5000),
        catchError((err: any) => {
          console.error('getCommandes error:', err);

          if (err && err.status === 401) {
            this.toast.showError('Session expirée. Reconnecte-toi.');
            this.router.navigateByUrl('/login');
          } else if (err && err.status === 403) {
            this.errorMessage = "Accès refusé.";
            this.toast.showError("Accès refusé.");
          } else {
            this.errorMessage = 'Erreur lors du chargement des commandes.';
            this.toast.showError(this.errorMessage);
          }

          return of([] as Commande[]);
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe((data: Commande[]) => {
        this.commandes = data || [];
      });
  }

  deleteCommande(id: number): void {
    if (!confirm('Supprimer cette commande ?')) return;

    this.commandeService.deleteCommande(id).subscribe({
      next: () => {
        // ✅ retirer localement (pas de reload)
        const idNum = Number(id);
        this.commandes = this.commandes.filter((c: any) => Number(c.id) !== idNum);

        this.toast.showSuccess('Commande supprimée.');
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('deleteCommande error:', err);

        if (err && err.status === 401) {
          this.toast.showError('Session expirée. Reconnecte-toi.');
          this.router.navigateByUrl('/login');
        } else if (err && err.status === 403) {
          this.toast.showError('Accès refusé (ADMIN requis).');
        } else {
          this.toast.showError('Erreur lors de la suppression.');
        }
      }
    });
  }
}
