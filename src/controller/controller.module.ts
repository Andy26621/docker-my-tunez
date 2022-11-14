import { Module } from '@nestjs/common';
import { ServiceModule } from 'src/service/service.module';
import { AlbumsController } from './albums/albums.controller';
import { ArtistController } from './artist/artist.controller';
import { AuthController } from './auth/auth.controller';
import { SongController } from './song/song.controller';
import { UserController } from './user/user.controller';
import { GenreController } from './genre/genre.controller';
import { MembersController } from './members/members.controller';

@Module({
  imports: [ServiceModule],
  controllers: [
    AuthController,
    SongController,
    UserController,
    GenreController,
    ArtistController,
    MembersController,
    AlbumsController,
  ],
})
export class ControllerModule {}
