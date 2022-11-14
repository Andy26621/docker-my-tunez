import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AlbumEntity } from './album.entity';
import { GenreEntity } from './genre.entity';

@Entity({ name: 'song' })
export class SongEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'song_id' })
  id: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'duration' })
  duration: number;

  @Column({ name: 'song' })
  mp3: string;

  /* @Column({ name: 'realese_year' })
  releaseYear: string; 
  Se quito a pedido de andrew*/

  @ManyToOne(() => AlbumEntity, (album) => album.songs)
  @JoinColumn({ name: 'album_id' })
  album: AlbumEntity;

  @ManyToOne(() => GenreEntity, (genre) => genre.songs)
  @JoinColumn({ name: 'genre_id' })
  genre: GenreEntity;
}
