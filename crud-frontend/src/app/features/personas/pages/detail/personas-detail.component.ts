import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonasService } from '../../services/personas.service';
import { Persona } from '../../models/persona.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-personas-detail',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './personas-detail.html',
})
export class PersonasDetailComponent {
  readonly personasService = inject(PersonasService);
  readonly persona = signal<Persona | undefined>(undefined);
  readonly loading = signal(true);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.personasService
      .findOne(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (persona) => {
          this.persona.set(persona);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onBack(): void {
    this.router.navigate(['/personas']);
  }

  onEdit(): void {
    this.router.navigate(['/personas', this.persona()!.id, 'editar']);
  }

  onDelete(): void {
    const persona = this.persona()!;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar persona',
        message: `¿Seguro que deseas eliminar a ${persona.nombre} ${persona.apellidos}? Esta acción no se puede deshacer.`,
        confirmLabel: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.personasService.remove(persona.id).subscribe({
          next: () => {
            this.snackBar.open('Persona eliminada correctamente', 'Cerrar', { duration: 3000 });
            this.onBack();
          },
        });
      }
    });
  }
}