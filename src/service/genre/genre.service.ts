import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GenreDto } from 'src/dto/genre.dto';
import { GenreEntity } from 'src/persistence/entities/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(GenreEntity, 'postgres')
    private genreRepository: Repository<GenreEntity>,
  ) {}

  async create(data: GenreDto) {
    return await this.genreRepository.save({
      name: data.name,
    });
  }

  async getAll() {
    return await this.genreRepository.find();
  }
}
