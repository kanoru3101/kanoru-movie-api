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
import TVSeason from "./TVSeason";

@Entity({
  name: 'tv_episode',
})
@Unique(['language', 'tmdb_id'])
@Unique(['language', 'tmdb_id', 'episode_number'])
class TVEpisode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer'})
  tmdb_id: number

  @Column({ type: 'varchar' })
  imdb_id: string

  @Column({type: 'varchar'})
  language: MOVIE_LANGUAGE

  @Column({ type: 'varchar', nullable: true })
  name?: string

  @Column({ type: 'varchar', nullable: true })
  overview?: string

  @Column({ type: 'varchar', nullable: true })
  poster_path?: string

  @Column({ type: 'integer' })
  episode_number: number

  @Column({ type: 'varchar', nullable: true})
  air_date?: string

  @Column({ type: 'real', nullable: true })
  vote_average?: number

  @Column({ type: 'integer', nullable: true })
  vote_count?: number;

  @CreateDateColumn({ type: "timestamp", default: () => "current_timestamp" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "current_timestamp", onUpdate: "current_timestamp" })
  public updated_at: Date;

  @ManyToOne(() => TVSeason, (tvSeason) => tvSeason.episodes)
  tvSeason: TVSeason;

  @OneToMany(() => Video, (video) => video.tv_season, { cascade: true, eager: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  videos: Video[];
}

export default TVEpisode
