import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'personas', pathMatch: 'full' },
  {
    path: 'personas',
    loadChildren: () =>
      import('./features/personas/personas.routes').then((m) => m.personasRoutes),
  },
  { path: '**', redirectTo: 'personas' },
];