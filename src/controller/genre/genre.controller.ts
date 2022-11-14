import { Body, Controller, Get, Post } from '@nestjs/common';
import { GenreDto } from 'src/dto/genre.dto';
import { GenreService } from 'src/service/genre/genre.service';

@Controller('genre')
export class GenreController {
  constructor(private genreService: GenreService) {}

  @Get()
  async findAll() {
    return await this.genreService.getAll();
  }

  @Post('create')
  async create(@Body() songDto: GenreDto) {
    return await this.genreService.create(songDto);
  }
}
