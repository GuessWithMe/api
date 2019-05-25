import {
  Table, Model, Column, BelongsToMany, PrimaryKey, AutoIncrement, HasMany,
  BelongsTo
} from 'sequelize-typescript';
import { Artist, SongArtist, Album } from '@models';

@Table({ tableName: 'songs' })
export class Song extends Model<Song> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @BelongsToMany(() => Artist, () => SongArtist)
  public artists: Artist[];

  @BelongsTo(() => Album, 'albumId')
  public album: Album;

  @Column
  public name: string;

  @Column
  public popularity: string;

  @Column
  public previewUrl: string;

  @Column
  public spotifyId: string;

  @Column
  public spotifyUrl: string;
}
