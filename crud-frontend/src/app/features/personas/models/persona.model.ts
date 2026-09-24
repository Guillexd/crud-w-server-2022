export interface Persona {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string | null;
  fechaNacimiento: string | null;
  direccion: string | null;
  foto: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface PersonaPayload {
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  direccion?: string;
}