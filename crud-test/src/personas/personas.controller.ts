import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PersonasService } from './personas.service';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { FindPersonasDto } from './dto/find-personas.dto';
import { fotoUploadOptions } from './config/photo-upload.config';

@Controller('personas')
export class PersonasController {
  constructor(private readonly personasService: PersonasService) {}

  @Post()
  @UseInterceptors(FileInterceptor('foto', fotoUploadOptions))
  create(
    @Body() createPersonaDto: CreatePersonaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('La foto es obligatoria (campo "foto")');
    }
    return this.personasService.create(createPersonaDto, file.filename);
  }

  @Get()
  findAll(@Query() filter: FindPersonasDto) {
    return this.personasService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personasService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('foto', fotoUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePersonaDto: UpdatePersonaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.personasService.update(id, updatePersonaDto, file?.filename);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.personasService.remove(id);
  }
}
