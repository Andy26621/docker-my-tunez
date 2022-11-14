import { Module } from '@nestjs/common';
import { AlbumsService } from './albums/albums.service';
import { AlbumEntity } from 'src/persistence/entities/album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataBasesEnum } from 'src/persistence/data-bases.enum';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from './auth/jwt.const';
import { UserEntity } from 'src/persistence/entities/user.entity';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserService } from './user/user.service';
import { PlaylistService } from './playlist/playlist.service';
import { SongService } from './song/song.service';
import { SongEntity } from 'src/persistence/entities/song.entity';
import { GenreEntity } from 'src/persistence/entities/genre.entity';
import { GenreService } from './genre/genre.service';
import { ArtistEntity } from 'src/persistence/entities/artist.entity';
import { MemberEntity } from 'src/persistence/entities/member.entity';
import { ArtistService } from './artist/artist.service';
import { MembersService } from './members/members.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        UserEntity,
        ArtistEntity,
        MemberEntity,
        SongEntity,
        AlbumEntity,
        GenreEntity,
      ],
      DataBasesEnum.POSTGRES,
    ),
    JwtModule.register({
      secret: JwtConstants.key,
      signOptions: { expiresIn: '60000s' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    PlaylistService,
    SongService,
    GenreService,
    ArtistService,
    MembersService,
    AlbumsService,
  ],
  exports: [
    AuthService,
    JwtStrategy,
    UserService,
    AlbumsService,
    SongService,
    GenreService,
    ArtistService,
    MembersService,
  ],
})
export class ServiceModule {}
