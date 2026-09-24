import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonasController } from './personas.controller';
import { PersonasService } from './personas.service';
import { PersonasRepository } from './personas.repository';
import { Persona } from './entities/persona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Persona])],
  controllers: [PersonasController],
  providers: [PersonasService, PersonasRepository],
  exports: [PersonasService],
})
export class PersonasModule {}
