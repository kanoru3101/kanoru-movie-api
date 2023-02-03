import { MOVIE_STATUSES } from '@constants/index'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable } from 'typeorm'
import Genre from './genre'

@Entity({
  name: 'movie',
})
class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', unique: true})
  movie_db_id: number

  @Column({ type: 'integer', unique: true })
  imdb_id: number

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
  backdrop_path?: string

  @Column({ type: 'integer', nullable: true })
  budget?: number

  @Column({ type: 'varchar', nullable: true })
  homepage?: string

  @Column({ type: 'integer' })
  popularity: number

  @Column({ type: 'varchar', nullable: true })
  poster_path?: string

  @Column({ type: 'varchar' })
  release_date: string

  @Column({ type: 'integer' })
  revenue: number

  @Column({ type: 'integer', nullable: true })
  runtime?: number

  @Column({ type: 'varchar' })
  status?: MOVIE_STATUSES

  @Column({ type: 'varchar', nullable: true })
  tagline?: string

  @Column({ type: 'boolean' })
  video: boolean

  @Column({ type: 'integer' })
  vote_average?: number

  @Column({ type: 'integer' })
  vote_count?: number

  @ManyToMany(() => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[]
}

export default Movie