import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from 'src/persistence/entities/artist.entity';
import { MemberEntity } from 'src/persistence/entities/member.entity';
import { Repository } from 'typeorm';
import { AppDataSource } from 'src/data-source';
import { ArtistDto } from 'src/dto/artist.dto';
import { newArtistDto } from 'src/dto/new-artist.dto';
import { artistImgPath } from 'images/artist/artist-path';
import { removeFile } from 'src/utilities/file';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity, 'postgres')
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  public async getArtistCount() {
    return await this.artistRepository.createQueryBuilder('artist').getCount();
  }

  public async getArtists(name: string) {
    const queryBuilder = this.artistRepository.createQueryBuilder('artist');
    queryBuilder
      .leftJoinAndSelect('artist.members', 'members')
      .where('artist.name LIKE :name', { name })
      .orderBy('artist.name', 'ASC');
    const { entities } = await queryBuilder.getRawAndEntities();
    return entities;
  }

  public async getAll() {
    const queryBuilder = this.artistRepository.createQueryBuilder('artist');
    queryBuilder
      .leftJoinAndSelect('artist.members', 'members')
      .orderBy('artist.name', 'ASC');
    const { entities } = await queryBuilder.getRawAndEntities();
    return entities;
  }

  async saveArtist(artistDto: ArtistDto) {
    let newMember: Array<MemberEntity> = new Array<MemberEntity>();
    const newArtist: ArtistEntity = new ArtistEntity();
    newArtist.name = artistDto.name;
    newArtist.artistImg = artistDto.image;
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(newArtist).then(() => {
        newMember = artistDto.members.map((detail) => {
          const members = new MemberEntity();
          members.name = detail.name;
          members.artist = newArtist;
          return members;
        });
      });
      await queryRunner.manager.save(newMember);
      await queryRunner.commitTransaction();
    } catch (err) {
      removeFile(artistImgPath, artistDto.image);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Hubo un problema',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async getArtistId(name: string) {
    const id = await this.artistRepository.findOne({
      where: [{ name: name }],
      select: {
        id: true,
      },
    });
    return id;
  }

  public async updateArtist(artistDto: newArtistDto) {
    const updateArtist: ArtistEntity = new ArtistEntity();
    const artistId = await this.getArtistId(artistDto.name);
    if (!artistId) {
      return { Error: 'No existe el artista' };
    }
    updateArtist.id = artistId.id;
    updateArtist.name = artistDto.newName;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.getRepository(ArtistEntity).save(updateArtist);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Hubo un problema',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async deleteArtist(name: string) {
    const file = await this.artistRepository.findOne({
      where: {
        name: name,
      },
    });
    removeFile(artistImgPath, file.artistImg);
    const result = await this.artistRepository.delete({ name: name });
    return result;
  }
}
