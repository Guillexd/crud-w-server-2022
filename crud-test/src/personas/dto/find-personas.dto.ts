import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FindPersonasDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La pagina debe ser un numero entero' })
  @Min(1, { message: 'La pagina minima es 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El limite debe ser un numero entero' })
  @Min(1, { message: 'El limite minimo es 1' })
  @Max(100, { message: 'El limite maximo es 100' })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
