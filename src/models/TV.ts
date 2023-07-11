import {MOVIE_LANGUAGE, TV_STATUSES, TV_TYPES} from '@constants'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn, Unique, OneToMany
} from 'typeorm'
import Genre from "./Genre";
import Video from "./Video";
import TVSeason from "./TVSeason";

@Entity({
  name: 'tv',
})
@Unique(['language', 'tmdb_id', 'imdb_id'])
class TV extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'varchar'})
  language: MOVIE_LANGUAGE

  @Column({ type: 'integer'})
  tmdb_id: number

  @Column({ type: 'varchar' })
  imdb_id: string

  @Column({ type: 'varchar', nullable: true })
  title?: string

  @Column({ type: 'varchar', nullable: true })
  overview?: string

  @Column({ type: 'varchar' })
  original_title: string

  @Column({ type: 'varchar' })
  original_language: string

  @Column({ type: 'boolean' })
  adult: boolean

  @Column({ type: 'varchar', nullable: true })
  backdrop_path?: string | null

  @Column({ type: 'boolean' })
  in_production: boolean

  @Column({ type: 'varchar', nullable: true })
  homepage?: string

  @Column({ type: 'real' })
  popularity: number

  @Column({ type: 'varchar', nullable: true })
  poster_path?: string

  @Column({ type: 'varchar', nullable: true })
  first_air_date?: string

  @Column({ type: 'varchar', nullable: true })
  last_air_date?: string

  @Column({ type: 'integer', default: 0 })
  number_of_episodes?: number

  @Column({ type: 'integer', default: 0 })
  number_of_seasons?: number

  @Column({ type: 'integer', nullable: true })
  runtime?: number

  @Column({ type: 'varchar' })
  status?: TV_STATUSES

  @Column({ type: 'varchar', nullable: true })
  tagline?: string

  // @Column({ type: 'boolean' })
  // video: boolean

  @Column({ type: 'varchar'})
  type?: TV_TYPES

  @Column({ type: 'real' })
  vote_average?: number

  @Column({ type: 'integer' })
  vote_count?: number;

  @CreateDateColumn({ type: "timestamp", default: () => "current_timestamp" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "current_timestamp", onUpdate: "current_timestamp" })
  public updated_at: Date;

  @ManyToMany(() => Genre, (genre) => genre.tvs, { cascade: true, eager: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  genres: Genre[];

  @OneToMany(() => Video, (video) => video.tv, { cascade: true, eager: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  videos: Video[];

  @OneToMany(() => TVSeason, (tvSeason) => tvSeason.tv, { cascade: true, eager: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  seasons: TVSeason[]
  //
  // @OneToMany(() => Cast, (cast) => cast.movie)
  // cast: Cast[]
}

export default TV
