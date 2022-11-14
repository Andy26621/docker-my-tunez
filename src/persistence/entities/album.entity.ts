import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ArtistEntity } from './artist.entity';
import { SongEntity } from './song.entity';

@Entity({ name: 'album' })
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'album_id' })
  id: string;

  @Column({ name: 'title' })
  title: string;

  /* @Column({ name: 'realese_year' })
  releaseYear: string; 
  Se quito a pedido de andrew RIP x2*/

  @Column({ name: 'cover_image' })
  coverImg: string;

  @OneToMany(() => SongEntity, (song) => song.album)
  songs: SongEntity[];

  @ManyToOne(() => ArtistEntity, (artist) => artist.albums, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistEntity;
}
