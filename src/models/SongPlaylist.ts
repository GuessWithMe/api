import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { Playlist, Song } from '@models';

@Table({ tableName: 'songPlaylists' })
export class SongPlaylist extends Model<SongPlaylist> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @BelongsTo(() => Song, 'songId')
  public song: Song;

  @BelongsTo(() => Playlist, 'playlistId')
  public playlist: Playlist;

  @ForeignKey(() => Song)
  @Column
  public songId: number;

  @ForeignKey(() => Playlist)
  @Column
  public playlistId: number;
}
