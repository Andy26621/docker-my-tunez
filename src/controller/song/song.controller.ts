import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { SongDto } from 'src/dto/song.dto';
import { SongService } from 'src/service/song/song.service';
import type { Response } from 'express';
import { songsPath } from 'fileSongs/path';
import { createReadStream } from 'fs';

@Controller('song')
export class SongController {
  constructor(private songService: SongService) {}

  @Get()
  async findAll() {
    return await this.songService.getAll();
  }

  @Get('album/:album')
  async songsbyAlbum(@Param('album') id) {
    return await this.songService.songsbyAlbum(id);
  }

  @Get('genre/:genre')
  async songsByGenre(@Param('genre') id) {
    return await this.songService.songsByGenre(id);
  }

  @Post('create')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './fileSongs',
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
    @Body() songDto: SongDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    console.log(file);
    songDto.mp3 = file.filename;
    return await this.songService.create(songDto);
  }

  @Delete(':id')
  async delete(@Param('id') id) {
    return await this.songService.delete(id);
  }

  @Get('play/:id')
  @Header('Content-Type', 'audio/mpeg')
  @Header('Content-Disposition', 'inline; filename="cancionsita.mp3"')
  async songLink(@Res({ passthrough: true }) res: Response, @Param('id') id) {
    const song = await this.songService.findOne(id);
    const file = createReadStream(join(songsPath, song.mp3));
    return new StreamableFile(file);
  }
}
