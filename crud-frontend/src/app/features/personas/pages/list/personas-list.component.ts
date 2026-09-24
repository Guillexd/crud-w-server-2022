import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PersonasService } from '../../services/personas.service';
import { Persona } from '../../models/persona.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-personas-list',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './personas-list.html',
})
export class PersonasListComponent {
  readonly personasService = inject(PersonasService);
  readonly personas = signal<Persona[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);
  readonly page = signal(0);
  readonly limit = signal(10);
  readonly search = signal('');
  readonly searchControl = new FormControl('');

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term) => {
        this.search.set((term ?? '').trim());
        this.page.set(0);
        this.load();
      });
    this.load();
  }

  onClearSearch(): void {
    this.searchControl.setValue('');
  }

  onPage(event: PageEvent): void {
    this.page.set(event.pageIndex);
    this.limit.set(event.pageSize);
    this.load();
  }

  onView(persona: Persona): void {
    this.router.navigate(['/personas', persona.id]);
  }

  onEdit(persona: Persona): void {
    this.router.navigate(['/personas', persona.id, 'editar']);
  }

  onDelete(persona: Persona): void {
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
        this.delete(persona.id);
      }
    });
  }

  private load(): void {
    this.loading.set(true);
    this.personasService
      .findAll(this.page() + 1, this.limit(), this.search())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.personas.set(result.data);
          this.total.set(result.total);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  private delete(id: number): void {
    this.personasService.remove(id).subscribe({
      next: () => this.load(),
    });
  }
}