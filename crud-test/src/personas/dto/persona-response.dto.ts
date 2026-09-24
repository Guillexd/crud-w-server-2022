import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { Persona } from '../entities/persona.entity';

@Exclude()
export class PersonaResponseDto {
  @Expose() id!: number;

  @Expose() nombre!: string;

  @Expose() apellidos!: string;

  @Expose() email!: string;

  @Expose() telefono!: string | null;

  @Expose() fechaNacimiento!: string | null;

  @Expose() direccion!: string | null;

  @Expose() foto!: string | null;

  @Expose() activo!: boolean;

  @Expose() createdAt!: Date;

  @Expose() updatedAt!: Date;

  static fromEntity(persona: Persona): PersonaResponseDto {
    return plainToInstance(PersonaResponseDto, persona, {
      excludeExtraneousValues: true,
    });
  }

  static fromEntities(personas: Persona[]): PersonaResponseDto[] {
    return personas.map((persona) => this.fromEntity(persona));
  }
}
