import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn, Unique
} from 'typeorm'
import Movie from './Movie'
import {MOVIE_LANGUAGE} from "@constants";

@Entity({
  name: 'genre',
})
@Unique(['language', 'tmdb_id'])
@Unique(['language', 'name'])
class Genre extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'varchar'})
  language: MOVIE_LANGUAGE

  @Column({ type: 'integer' })
  tmdb_id: number

  @Column({ type: 'varchar' })
  name: string

  @CreateDateColumn({ type: "timestamp", default: () => "current_timestamp" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "current_timestamp", onUpdate: "current_timestamp" })
  public updated_at: Date;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  @JoinTable()
  movies: Movie[]
}

export default Genre
