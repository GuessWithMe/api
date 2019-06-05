import { AutoIncrement, BelongsTo, BelongsToMany, Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { Album, Artist, Playlist, SongArtist, SongPlaylist } from '@models';

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

  @BelongsToMany(() => Playlist, () => SongPlaylist)
  public playlists: Playlist[];

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
