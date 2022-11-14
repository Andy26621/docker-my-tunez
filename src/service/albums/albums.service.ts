import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { albumImgPath } from 'images/album/album-path';
import { AppDataSource } from 'src/data-source';
import { AlbumDto } from 'src/dto/album.dto';
import { newAlbumDto } from 'src/dto/new-album.dto';
import { AlbumEntity } from 'src/persistence/entities/album.entity';
import { ArtistEntity } from 'src/persistence/entities/artist.entity';
import { removeFile } from 'src/utilities/file';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(AlbumEntity, 'postgres')
    private albumRepository: Repository<AlbumEntity>,
    @InjectRepository(ArtistEntity, 'postgres')
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  public async getAlbumCount(name: ArtistEntity) {
    const value = await this.albumRepository.findAndCount({
      where: [{ artist: name }],
      select: {
        id: true,
        title: true,
        coverImg: true,
        songs: true,
      },
    });
    console.log(value);
    return value[0];
  }

  public async getArtistId(name: string) {
    const id = await this.artistRepository.findOne({
      where: [{ name: name }],
      select: {
        id: true,
      },
    });
    console.log(id);
    return id;
  }

  async saveAlbum(albumDto: AlbumDto, artist: string) {
    const newAlbum: AlbumEntity = new AlbumEntity();
    const newArtist: ArtistEntity = new ArtistEntity();
    const artistId = await this.getArtistId(artist);
    if (!artistId) {
      return { Error: 'No existe el artista' };
    }
    newArtist.id = artistId.id;
    newAlbum.title = albumDto.title;
    newAlbum.coverImg = albumDto.coverImg;
    newAlbum.artist = newArtist;
    console.log(newAlbum);
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(newAlbum);
      await queryRunner.commitTransaction();
    } catch (err) {
      removeFile(albumImgPath, albumDto.coverImg);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Hubo un problema',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async updateAlbum(newAlbum: newAlbumDto) {
    const albumData: AlbumEntity = new AlbumEntity();
    albumData.id = newAlbum.id;
    albumData.coverImg = newAlbum.coverImg;
    albumData.title = newAlbum.title;
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .getRepository(AlbumEntity)
          .save(albumData);
      },
    );
  }

  public async deleteAlbum(id: string) {
    const file = await this.albumRepository.findOne({
      where: {
        id: id,
      },
    });
    removeFile(albumImgPath, file.coverImg);
    const result = await this.albumRepository.delete({ id: id });
    return result;
  }
}
