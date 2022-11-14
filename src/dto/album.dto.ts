import { IsOptional, IsString } from 'class-validator';
import { ArtistEntity } from 'src/persistence/entities/artist.entity';

export class AlbumDto {
  @IsString()
  title: string;
  @IsString()
  @IsOptional()
  coverImg: string;
  artist: ArtistEntity;
  @IsString()
  artistName: string;
}
