import { IsOptional, IsString } from 'class-validator';
import { MembersDto } from './members.dto';
export class ArtistDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  image: string;
  members: MembersDto[];
}
