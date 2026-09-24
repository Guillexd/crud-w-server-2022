import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResult, Persona, PersonaPayload } from '../models/persona.model';

@Injectable({ providedIn: 'root' })
export class PersonasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/personas`;

  create(payload: PersonaPayload, foto: File): Observable<Persona> {
    const formData = PersonasService.toFormData(payload);
    formData.append('foto', foto, foto.name);
    return this.http.post<Persona>(this.baseUrl, formData);
  }

  findAll(page: number, limit: number, search?: string): Observable<PaginatedResult<Persona>> {
    let params = new HttpParams().set('page', String(page)).set('limit', String(limit));
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<PaginatedResult<Persona>>(this.baseUrl, { params });
  }

  findOne(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.baseUrl}/${id}`);
  }

  update(id: number, payload: Partial<PersonaPayload>, foto?: File): Observable<Persona> {
    const formData = PersonasService.toFormData(payload);
    if (foto) {
      formData.append('foto', foto, foto.name);
    }
    return this.http.patch<Persona>(`${this.baseUrl}/${id}`, formData);
  }

  remove(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  fotoUrl(foto: string | null): string {
    return foto ? `${environment.apiUrl}${foto}` : '';
  }

  private static toFormData(payload: object): FormData {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (typeof value === 'string' && value !== '') {
        formData.append(key, value);
      }
    });
    return formData;
  }
}