import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ArtistDto } from 'src/dto/artist.dto';
import { newArtistDto } from 'src/dto/new-artist.dto';
import { ArtistService } from 'src/service/artist/artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images/artist',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() artistDto: ArtistDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    artistDto.image = file.filename;
    return await this.artistService.saveArtist(artistDto);
  }

  @Post('add')
  saveArtist(@Body() artistData: ArtistDto) {
    return this.artistService.saveArtist(artistData);
  }

  @Get()
  public async getArtists(@Query() query) {
    console.log('query param', query.value);
    return await this.artistService.getArtists(query.value);
  }

  @Get('all')
  public async getAll() {
    return await this.artistService.getAll();
  }

  @Put()
  updateSale(@Body() artistData: newArtistDto) {
    return this.artistService.updateArtist(artistData);
  }

  @Delete(':name')
  public async deleteArtist(@Param('name') name: string) {
    return await this.artistService.deleteArtist(name);
  }
}
