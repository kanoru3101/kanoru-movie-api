import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable} from 'typeorm'
import Movie from './movie'

@Entity({
  name: 'genre',
})
class Genre extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'integer', unique: true})
  movie_db_id: number

  @Column({ type: 'varchar', unique: true })
  name: string

  @Column({ type: 'varchar', unique: true })
  name_ua: string

  @ManyToMany(() => Movie, (movie) => movie.genres, { cascade: true, eager: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
  @JoinTable()
  movies: Movie[]
}

export default Genre
