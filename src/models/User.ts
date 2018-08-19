import {
  Table, Model, Column
} from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model<User> {

  @Column
  public spotifyUsername: string;

  @Column
  public spotifyId: string;

  @Column
  public spotifyAccessToken: string;

  @Column
  public spotifyRefreshToken: string;

  @Column
  public spotifyDisplayName: string;

  @Column
  public spotifyImageUrl: string;

  @Column
  public tokenExpiresAt: Date;
}
