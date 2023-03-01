import { MOVIE_STATUSES } from '@constants/index'
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, OneToMany} from 'typeorm'
import Genre from "./genre";
import Video from "./video";

@Entity({
  name: 'movie',
})
class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', unique: true})
  movie_db_id: number

  @Column({ type: 'varchar', unique: true })
  imdb_id: string

  @Column({ type: 'varchar', nullable: true })
  title?: string

  @Column({ type: 'varchar', nullable: true })
  title_ua?: string

  @Column({ type: 'varchar', nullable: true })
  overview?: string

  @Column({ type: 'varchar', nullable: true })
  overview_ua?: string

  @Column({ type: 'varchar' })
  original_title: string

  @Column({ type: 'varchar' })
  original_language: string

  @Column({ type: 'boolean' })
  adult: boolean

  @Column({ type: 'varchar', nullable: true })
  backdrop_path?: string | null

  @Column({ type: 'varchar', nullable: true })
  backdrop_path_ua?: string | null

  @Column({ type: 'integer', nullable: true })
  budget?: number

  @Column({ type: 'varchar', nullable: true })
  homepage?: string

  @Column({ type: 'real' })
  popularity: number

  @Column({ type: 'varchar', nullable: true })
  poster_path?: string

  @Column({ type: 'varchar', nullable: true })
  poster_path_ua?: string

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

  @Column({ type: 'varchar', nullable: true })
  tagline_ua?: string

  @Column({ type: 'boolean' })
  video: boolean

  @Column({ type: 'real' })
  vote_average?: number

  @Column({ type: 'integer' })
  vote_count?: number;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres: Genre[];

  @OneToMany(() => Video, (video) => video.movie)
  videos: Video[];
}

export default Movie
