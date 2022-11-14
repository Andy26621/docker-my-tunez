import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ArtistEntity } from './artist.entity';

@Entity({ name: 'member' })
export class MemberEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'member_id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @ManyToOne(() => ArtistEntity, (artist) => artist.members, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'artist_id' })
  artist: ArtistEntity;
}
