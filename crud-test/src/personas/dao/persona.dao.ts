import { CreatePersonaDto } from '../dto/create-persona.dto';
import { FindPersonasDto } from '../dto/find-personas.dto';
import { UpdatePersonaDto } from '../dto/update-persona.dto';
import { Persona } from '../entities/persona.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface PersonaDao {
  findAll(filter: FindPersonasDto): Promise<PaginatedResult<Persona>>;
  findById(id: number): Promise<Persona | null>;
  create(dto: CreatePersonaDto, foto?: string): Promise<Persona>;
  update(
    id: number,
    dto: UpdatePersonaDto,
    foto?: string,
  ): Promise<Persona | null>;
  remove(id: number): Promise<boolean>;
  existsByEmail(email: string, excludeId?: number): Promise<boolean>;
}
