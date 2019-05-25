import {
  Table, Model, Column, BelongsTo
} from 'sequelize-typescript';
import { Artist } from '@models';

@Table({ tableName: 'albums' })
export class Album extends Model<Album> {
  @Column
  public name: string;

  @Column
  public spotifyId: string;

  @Column
  public imageUrl: string;

  @Column
  public releaseDate: Date;

  @Column
  public spotifyUrl: string;
}
