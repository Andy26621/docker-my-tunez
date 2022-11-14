import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AlbumEntity } from './album.entity';
import { MemberEntity } from './member.entity';

@Entity({ name: 'artist' })
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'artist_id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ nullable: true, name: 'artist_image' })
  artistImg: string;

  /* @Column({ name: 'web_site' })
  webSite: string; 
  Se quito a pedido de gio RIP...*/

  @OneToMany(() => MemberEntity, (member) => member.artist)
  members: MemberEntity[];

  @OneToMany(() => AlbumEntity, (album) => album.artist)
  albums: AlbumEntity[];
}
