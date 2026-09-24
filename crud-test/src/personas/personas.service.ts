import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PersonasRepository } from './personas.repository';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { FindPersonasDto } from './dto/find-personas.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { PersonaResponseDto } from './dto/persona-response.dto';
import { PaginatedResult } from './dao/persona.dao';
import { buildFotoUrl } from './config/photo-upload.config';
import { deleteFotoFile } from './files.util';

@Injectable()
export class PersonasService {
  constructor(private readonly personasRepository: PersonasRepository) {}

  async create(
    createPersonaDto: CreatePersonaDto,
    fotoFileName?: string,
  ): Promise<PersonaResponseDto> {
    await this.assertEmailAvailable(createPersonaDto.email);
    const foto = fotoFileName ? buildFotoUrl(fotoFileName) : undefined;
    const persona = await this.personasRepository.create(
      createPersonaDto,
      foto,
    );
    return PersonaResponseDto.fromEntity(persona);
  }

  async findAll(
    filter: FindPersonasDto,
  ): Promise<PaginatedResult<PersonaResponseDto>> {
    const { data, total } = await this.personasRepository.findAll(filter);
    return { data: PersonaResponseDto.fromEntities(data), total };
  }

  async findOne(id: number): Promise<PersonaResponseDto> {
    const persona = await this.personasRepository.findById(id);
    if (!persona) {
      throw new NotFoundException(`La persona con id ${id} no existe`);
    }
    return PersonaResponseDto.fromEntity(persona);
  }

  async update(
    id: number,
    updatePersonaDto: UpdatePersonaDto,
    fotoFileName?: string,
  ): Promise<PersonaResponseDto> {
    if (updatePersonaDto.email) {
      await this.assertEmailAvailable(updatePersonaDto.email, id);
    }

    const foto = fotoFileName ? buildFotoUrl(fotoFileName) : undefined;
    const persona = await this.personasRepository.update(
      id,
      updatePersonaDto,
      foto,
    );
    if (!persona) {
      throw new NotFoundException(`La persona con id ${id} no existe`);
    }
    return PersonaResponseDto.fromEntity(persona);
  }

  async remove(id: number): Promise<{ message: string }> {
    const persona = await this.personasRepository.findById(id);
    if (!persona) {
      throw new NotFoundException(`La persona con id ${id} no existe`);
    }

    await this.personasRepository.remove(id);
    await deleteFotoFile(persona.foto);
    return { message: `Persona con id ${id} eliminada correctamente` };
  }

  private async assertEmailAvailable(
    email: string,
    excludeId?: number,
  ): Promise<void> {
    const exists = await this.personasRepository.existsByEmail(
      email,
      excludeId,
    );
    if (exists) {
      throw new ConflictException(`El email ${email} ya esta registrado`);
    }
  }
}
