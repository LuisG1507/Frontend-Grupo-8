import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../models/Role';
import { Roleservice } from '../../../services/roleservice';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-role-update',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
  ],
  templateUrl: './role-update.html',
  styleUrl: './role-update.css',
})
export class RoleUpdate implements OnInit {
  role: Role = new Role();
  id: number = 0;

  constructor(
    private rS: Roleservice,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.rS.listId(this.id).subscribe((data) => {
      this.role = data;
    });
  }

  aceptar() {
    this.rS.update(this.id, this.role).subscribe(() => {
      this.snackBar.open('Rol actualizado correctamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/roles/list']);
    });
  }

  cancelar() {
    this.router.navigate(['/roles/list']);
  }
}
