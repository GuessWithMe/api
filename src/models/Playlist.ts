import { Column, Model, Table, BelongsTo } from 'sequelize-typescript';
import { User } from '@models';

@Table({ tableName: 'playlists' })
export class Playlist extends Model<Playlist> {
  @Column
  public spotifyId: string;

  @Column
  public lastImportAt: Date;

  @Column
  public totalSongsAtLastImport: number;

  @Column
  public eligibleSongsAtLastImport: number;

  @BelongsTo(() => User, 'userId')
  public user: User;
}
