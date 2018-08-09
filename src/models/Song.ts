import {
  Table, Model, Column
} from 'sequelize-typescript';

@Table({ tableName: 'songs' })
export class Song extends Model<Song> {

  @Column
  public name: string;

  @Column
  public spotifyId: string;

  @Column
  public popularity: string;

  @Column
  public previewUrl: string;
}
