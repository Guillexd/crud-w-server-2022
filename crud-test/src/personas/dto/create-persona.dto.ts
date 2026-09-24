import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePersonaDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  nombre!: string;

  @IsString({ message: 'Los apellidos deben ser un texto' })
  @IsNotEmpty({ message: 'Los apellidos son requeridos' })
  @MaxLength(100, {
    message: 'Los apellidos no pueden superar los 100 caracteres',
  })
  apellidos!: string;

  @IsEmail({}, { message: 'El email no es valido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  @MaxLength(150, { message: 'El email no puede superar los 150 caracteres' })
  email!: string;

  @IsOptional()
  @IsString({ message: 'El telefono debe ser un texto' })
  @MaxLength(20, { message: 'El telefono no puede superar los 20 caracteres' })
  telefono?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe tener formato YYYY-MM-DD' },
  )
  fechaNacimiento?: string;

  @IsOptional()
  @IsString({ message: 'La direccion debe ser un texto' })
  @MaxLength(255, {
    message: 'La direccion no puede superar los 255 caracteres',
  })
  direccion?: string;
}
