import { Routes } from '@angular/router';
import { PersonasDetailComponent } from './pages/detail/personas-detail.component';
import { PersonasFormComponent } from './pages/form/personas-form.component';
import { PersonasListComponent } from './pages/list/personas-list.component';

export const personasRoutes: Routes = [
  { path: '', component: PersonasListComponent },
  { path: 'nuevo', component: PersonasFormComponent },
  { path: ':id/editar', component: PersonasFormComponent },
  { path: ':id', component: PersonasDetailComponent },
];