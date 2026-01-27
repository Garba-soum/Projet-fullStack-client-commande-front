import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] // ✅ important
})
export class Login {

  username: string = '';
  password: string = '';
  role: 'USER' | 'ADMIN' = 'USER';

  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.loading = true;

    const login$ = this.role === 'ADMIN'
      ? this.authService.loginAdmin(this.username, this.password)
      : this.authService.loginUser(this.username, this.password);

    login$.subscribe({
      next: () => {
        this.loading = false;
        
        // retour là où l'utilisateur voulait aller
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/clients';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Identifiants incorrects';
      }
    });
  }
}
