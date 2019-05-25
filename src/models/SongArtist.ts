import {
  Table, Model, Column, BelongsTo, PrimaryKey, AutoIncrement, ForeignKey
} from 'sequelize-typescript';
import { Artist, Song } from '@models';

@Table({ tableName: 'songArtists' })
export class SongArtist extends Model<SongArtist> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @BelongsTo(() => Song, 'songId')
  public song: Song;

  @BelongsTo(() => Artist, 'artistId')
  public artist: Artist;

  @ForeignKey(() => Song)
  @Column
  public songId: number;

  @ForeignKey(() => Artist)
  @Column
  public artistId: number;
}
