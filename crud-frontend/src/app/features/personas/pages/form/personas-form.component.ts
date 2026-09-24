import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonasService } from '../../services/personas.service';
import { PersonaPayload } from '../../models/persona.model';

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

@Component({
  selector: 'app-personas-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './personas-form.html',
})
export class PersonasFormComponent {
  readonly personasService = inject(PersonasService);

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    telefono: ['', [Validators.maxLength(20)]],
    fechaNacimiento: [''],
    direccion: ['', [Validators.maxLength(255)]],
  });

  readonly isEdit = signal(false);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly selectedFile = signal<File | null>(null);
  readonly previewUrl = signal('');
  readonly fileError = signal('');

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  private readonly personaId = signal<number | undefined>(undefined);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isInteger(id) && id > 0) {
      this.personaId.set(id);
      this.isEdit.set(true);
      this.loadPersona();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    if (!ALLOWED_MIMETYPES.includes(file.type)) {
      this.fileError.set('Solo se permiten imagenes JPG, PNG, GIF o WEBP');
      input.value = '';
      return;
    }

    this.fileError.set('');
    if (this.previewUrl()) {
      URL.revokeObjectURL(this.previewUrl());
    }
    this.selectedFile.set(file);
    this.previewUrl.set(URL.createObjectURL(file));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.isEdit() && !this.selectedFile()) {
      this.fileError.set('La foto es obligatoria');
      return;
    }

    this.saving.set(true);
    const payload = this.buildPayload();

    if (this.isEdit()) {
      this.saveEdit(payload);
    } else {
      this.saveCreate(payload);
    }
  }

  onCancel(): void {
    this.router.navigate(['/personas']);
  }

  private saveCreate(payload: PersonaPayload): void {
    this.personasService.create(payload, this.selectedFile()!).subscribe({
      next: (persona) => {
        this.snackBar.open('Persona creada correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/personas', persona.id]);
      },
      error: () => this.saving.set(false),
    });
  }

  private saveEdit(payload: PersonaPayload): void {
    this.personasService
      .update(this.personaId()!, payload, this.selectedFile() ?? undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (persona) => {
          this.snackBar.open('Persona actualizada correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/personas', persona.id]);
        },
        error: () => this.saving.set(false),
      });
  }

  private loadPersona(): void {
    this.loading.set(true);
    this.personasService
      .findOne(this.personaId()!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (persona) => {
          this.form.patchValue({
            nombre: persona.nombre,
            apellidos: persona.apellidos,
            email: persona.email,
            telefono: persona.telefono ?? '',
            fechaNacimiento: persona.fechaNacimiento ?? '',
            direccion: persona.direccion ?? '',
          });
          this.previewUrl.set(this.personasService.fotoUrl(persona.foto));
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.onCancel();
        },
      });
  }

  private buildPayload(): PersonaPayload {
    const value = this.form.value;
    return {
      nombre: value.nombre?.trim() ?? '',
      apellidos: value.apellidos?.trim() ?? '',
      email: value.email?.trim() ?? '',
      telefono: value.telefono?.trim() || undefined,
      fechaNacimiento: value.fechaNacimiento || undefined,
      direccion: value.direccion?.trim() || undefined,
    };
  }
}