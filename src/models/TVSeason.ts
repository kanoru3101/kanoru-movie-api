import {MOVIE_LANGUAGE} from '@constants'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn, Unique, OneToMany, ManyToOne
} from 'typeorm'
import Video from "./Video";
import TV from "./TV";
import TVEpisode from "./TVEpisode";

@Entity({
  name: 'tv_season',
})
@Unique(['language', 'tmdb_id'])
class TVSeason extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer'})
  tmdb_id: number

  @Column({type: 'varchar'})
  language: MOVIE_LANGUAGE

  @Column({ type: 'varchar', nullable: true })
  name?: string

  @Column({ type: 'varchar', nullable: true })
  overview?: string

  @Column({ type: 'varchar', nullable: true })
  poster_path?: string

  @Column({ type: 'integer', default: 0 })
  season_number?: number

  @CreateDateColumn({ type: "timestamp", default: () => "current_timestamp" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "current_timestamp", onUpdate: "current_timestamp" })
  public updated_at: Date;

  @ManyToOne(() => TV, (tv) => tv.seasons)
  tv: TV;

  @OneToMany(() => TVEpisode, (tvEpisode) => tvEpisode.tvSeason, { cascade: true, eager: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  episodes: TVEpisode[];

  @OneToMany(() => Video, (video) => video.tv_season, { cascade: true, eager: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  videos: Video[];
}

export default TVSeason
