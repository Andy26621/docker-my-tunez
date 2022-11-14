import { ArtistEntity } from 'src/persistence/entities/artist.entity';

export class MembersDto {
  name: string;
  artist: ArtistEntity;
  artistName: string;
}
