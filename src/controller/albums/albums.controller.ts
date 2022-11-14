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
import { AlbumDto } from 'src/dto/album.dto';
import { newAlbumDto } from 'src/dto/new-album.dto';
import { AlbumsService } from 'src/service/albums/albums.service';

@Controller('album')
export class AlbumsController {
  constructor(private albumService: AlbumsService) {}

  @Post('add')
  saveAlbum(@Body() albumData: AlbumDto) {
    return this.albumService.saveAlbum(albumData, albumData.artistName);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images/album',
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
    @Body() albumDto: AlbumDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    albumDto.coverImg = file.filename;
    return await this.albumService.saveAlbum(albumDto, albumDto.artistName);
  }

  @Get()
  public async getAlbumCount(@Query() query) {
    const artistId = await this.albumService.getArtistId(query.value);
    return await this.albumService.getAlbumCount(artistId);
  }

  @Put()
  updateAlbum(@Body() memebrData: newAlbumDto) {
    return this.albumService.updateAlbum(memebrData);
  }

  @Delete(':name')
  public async deleteAlbum(@Param('name') name: string) {
    return await this.albumService.deleteAlbum(name);
  }
}
