import {MOVIE_LANGUAGE, MOVIE_STATUSES} from '@constants/index'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn, Unique
} from 'typeorm'
import Genre from "./Genre";
import Video from "./Video";
import Cast from "./Cast";

@Entity({
  name: 'movie',
})
@Unique(['language', 'movie_db_id', 'imdb_id'])
class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'varchar'})
  language: MOVIE_LANGUAGE

  @Column({ type: 'integer'})
  movie_db_id: number

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

  @Column({ type: 'integer', nullable: true })
  budget?: number

  @Column({ type: 'varchar', nullable: true })
  homepage?: string

  @Column({ type: 'real' })
  popularity: number

  @Column({ type: 'varchar', nullable: true })
  poster_path?: string


  @Column({ type: 'varchar' })
  release_date: string

  @Column({ type: 'bigint' })
  revenue: number

  @Column({ type: 'integer', nullable: true })
  runtime?: number

  @Column({ type: 'varchar' })
  status?: MOVIE_STATUSES

  @Column({ type: 'varchar', nullable: true })
  tagline?: string

  @Column({ type: 'boolean' })
  video: boolean

  @Column({ type: 'real' })
  vote_average?: number

  @Column({ type: 'integer' })
  vote_count?: number;

  @CreateDateColumn({ type: "timestamp", default: () => "current_timestamp" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "current_timestamp", onUpdate: "current_timestamp" })
  public updated_at: Date;

  @ManyToMany(() => Genre, (genre) => genre.movies, { cascade: true, eager: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  genres: Genre[];

  @OneToMany(() => Video, (video) => video.movie, { cascade: true, eager: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  videos: Video[];

  @OneToMany(() => Cast, (cast) => cast.movie)
  cast: Cast[]
}

export default Movie
