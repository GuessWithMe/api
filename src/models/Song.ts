import {
  Table, Model, Column, BelongsToMany, PrimaryKey, AutoIncrement
} from 'sequelize-typescript';
import { Artist } from '@models/Artist';
import { SongArtist } from '@models/SongArtist';

@Table({ tableName: 'songs' })
export class Song extends Model<Song> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @BelongsToMany(() => Artist, () => SongArtist)
  public artists: Artist[];

  @Column
  public name: string;

  @Column
  public spotifyId: string;

  @Column
  public popularity: string;

  @Column
  public previewUrl: string;

  @Column
  public spotifyUrl: string;
}
