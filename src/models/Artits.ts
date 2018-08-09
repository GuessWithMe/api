import {
  Table, Model, Column, BelongsTo
} from 'sequelize-typescript';
import { Song } from '@models/Song';

@Table({ tableName: 'artists' })
export class Artist extends Model<Artist> {

  @BelongsTo(() => Song, 'songId')
  public user: Song;

  @Column
  public name: string;

  @Column
  public spotifyId: string;
}
