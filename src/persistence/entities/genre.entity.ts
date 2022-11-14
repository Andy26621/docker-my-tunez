import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SongEntity } from './song.entity';

@Entity({ name: 'genre' })
export class GenreEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'genre_id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => SongEntity, (song) => song.genre)
  songs: SongEntity[];
}
