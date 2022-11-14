import { IsInt, IsOptional, IsString } from 'class-validator';

export class SongDto {
  @IsString()
  title: string;
  @IsInt()
  duration: number;
  @IsOptional()
  @IsString()
  mp3: string;
  @IsString()
  album: string;
  @IsString()
  genre: string;
}
