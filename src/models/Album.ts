import { Column, Model, Table } from 'sequelize-typescript';

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
