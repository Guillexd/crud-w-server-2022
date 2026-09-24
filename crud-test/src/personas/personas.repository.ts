import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PersonaDao, PaginatedResult } from './dao/persona.dao';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { FindPersonasDto } from './dto/find-personas.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import { deleteFotoFile } from './files.util';

@Injectable()
export class PersonasRepository implements PersonaDao {
  private readonly repository: Repository<Persona>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Persona);
  }

  async findAll(filter: FindPersonasDto): Promise<PaginatedResult<Persona>> {
    const { page = 1, limit = 10, search } = filter;

    const queryBuilder = this.repository
      .createQueryBuilder('persona')
      .orderBy('persona.id', 'DESC');

    if (search) {
      queryBuilder.where(
        '(persona.nombre LIKE :search OR persona.apellidos LIKE :search OR persona.email LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findById(id: number): Promise<Persona | null> {
    return this.repository.findOneBy({ id });
  }

  async create(dto: CreatePersonaDto, foto?: string): Promise<Persona> {
    const persona = this.repository.create({ ...dto, foto: foto ?? null });
    return this.repository.save(persona);
  }

  async update(
    id: number,
    dto: UpdatePersonaDto,
    foto?: string,
  ): Promise<Persona | null> {
    const persona = await this.findById(id);
    if (!persona) {
      return null;
    }

    if (foto && foto !== persona.foto) {
      await deleteFotoFile(persona.foto);
    }

    Object.assign(persona, dto);
    if (foto) {
      persona.foto = foto;
    }
    return this.repository.save(persona);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  async existsByEmail(email: string, excludeId?: number): Promise<boolean> {
    const queryBuilder = this.repository
      .createQueryBuilder('persona')
      .where('LOWER(persona.email) = LOWER(:email)', { email })
      .select('persona.id');

    if (excludeId !== undefined) {
      queryBuilder.andWhere('persona.id <> :excludeId', { excludeId });
    }

    return queryBuilder.getExists();
  }
}
