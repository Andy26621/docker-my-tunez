import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { SongDto } from 'src/dto/song.dto';
import { AlbumEntity } from 'src/persistence/entities/album.entity';
import { GenreEntity } from 'src/persistence/entities/genre.entity';
import { SongEntity } from 'src/persistence/entities/song.entity';
import { Repository } from 'typeorm';
import { existsSync, unlink } from 'fs';
import { songsPath } from 'fileSongs/path';
@Injectable()
export class SongService {
  constructor(
    @InjectRepository(SongEntity, 'postgres')
    private songRepository: Repository<SongEntity>,
    @InjectRepository(AlbumEntity, 'postgres')
    private albumRepository: Repository<AlbumEntity>,
    @InjectRepository(GenreEntity, 'postgres')
    private genreRepository: Repository<GenreEntity>,
  ) {}

  async create(songDto: SongDto) {
    try {
      const albumFound = await this.albumRepository.findOne({
        where: {
          id: songDto.album,
        },
      });
      if (!albumFound) throw new HttpException('ALBUM_NOT_FOUND', 404);
      const genreFound = await this.genreRepository.findOne({
        where: {
          id: songDto.genre,
        },
      });
      if (!genreFound) throw new HttpException('GENRE_NOT_FOUND', 404);
      return await this.songRepository.save({
        title: songDto.title,
        duration: songDto.duration,
        mp3: songDto.mp3,
        album: albumFound,
        genre: genreFound,
      });
    } catch (error) {
      this._removeSong(songDto.mp3);
      throw new HttpException('SONG CREATIION FAILED', 404);
    }
  }

  async delete(id: string) {
    console.log(id);
    const song: SongEntity = await this.songRepository.findOne({
      where: {
        id: id,
      },
    });
    console.log(song);
    const deleted = await this.songRepository.delete(id);
    this._removeSong(song.mp3);
    return deleted;
  }

  async getAll() {
    return await this.songRepository.find({
      relations: {
        album: true,
        genre: true,
      },
    });
  }

  async songsbyAlbum(albumId: string) {
    const albumFound = await this.albumRepository.findOne({
      where: {
        id: albumId,
      },
    });
    if (!albumFound) throw new HttpException('ALBUM_NOT_FOUND', 404);
    return await this.songRepository.find({
      where: {
        album: albumFound,
      },
    });
  }

  async songsByGenre(genreId: string) {
    const genreFound = await this.genreRepository.findOne({
      where: {
        id: genreId,
      },
    });
    if (!genreFound) throw new HttpException('GENRE_NOT_FOUND', 404);
    return await this.songRepository.find({
      where: {
        genre: genreFound,
      },
    });
  }

  private async _removeSong(fileName: string) {
    const pathName = join(songsPath, fileName);
    console.log(pathName);
    if (existsSync(pathName)) {
      console.log('deleting...');
      unlink(pathName, (err) => {
        if (err) throw err;
        console.log(`${pathName} was deleted`);
      });
    }
  }

  async findOne(id: string) {
    return await this.songRepository.findOne({
      where: {
        id: id,
      },
    });
  }
}
