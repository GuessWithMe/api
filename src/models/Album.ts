import {
  Table, Model, Column, BelongsTo
} from 'sequelize-typescript';
import { Artist } from '@models/Artist';

@Table({ tableName: 'albums' })
export class Album extends Model<Album> {

  @BelongsTo(() => Artist, 'artistId')
  public artist: Artist;

  @Column
  public name: string;

  @Column
  public spotifyId: string;

  @Column
  public imageUrl: string;

  @Column
  public releaseDate: string;

  @Column
  public spotifyUrl: string;
}
