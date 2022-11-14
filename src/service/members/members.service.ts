import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MembersDto } from 'src/dto/members.dto';
import { ArtistEntity } from 'src/persistence/entities/artist.entity';
import { MemberEntity } from 'src/persistence/entities/member.entity';
import { Repository } from 'typeorm';
import { AppDataSource } from 'src/data-source';
import { newMemberDto } from 'src/dto/new-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberEntity, 'postgres')
    private memberRepository: Repository<MemberEntity>,
    @InjectRepository(ArtistEntity, 'postgres')
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  public async getMemberCount(name: ArtistEntity) {
    const value = await this.memberRepository.findAndCount({
      where: [{ artist: name }],
      select: {
        id: true,
        name: true,
      },
    });
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

  public async updateMember(newMember: newMemberDto) {
    const memberData: MemberEntity = new MemberEntity();
    memberData.id = newMember.id;
    memberData.name = newMember.newName;
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .getRepository(MemberEntity)
          .save(memberData);
      },
    );
  }

  async saveMember(memberDto: MembersDto, artist: string) {
    const newMember: MemberEntity = new MemberEntity();
    const newArtist: ArtistEntity = new ArtistEntity();
    const artistId = await this.getArtistId(artist);
    if (!artistId) {
      return { Error: 'No existe el artista' };
    }
    newArtist.id = artistId.id;
    newMember.name = memberDto.name;
    newMember.artist = newArtist;
    console.log(newMember);
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(newMember);
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Hubo un problema',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async deleteMember(id: string) {
    const result = await this.memberRepository.delete({ id: id });
    return result;
  }
}
