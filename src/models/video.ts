import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from 'typeorm'
import Movie from './movie'
import {MOVIE_LANGUAGE} from "@constants";

@Entity({
    name: 'video',
})
class Video extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column({type: 'varchar'})
    movie_id: string

    @Column({type: 'varchar', unique: true})
    movie_db_id: string

    @Column({type: 'varchar'})
    language: MOVIE_LANGUAGE

    @Column({type: 'varchar'})
    name: string

    @Column({type: 'varchar'})
    site: string

    @Column({type: 'varchar', unique: true})
    key: string

    @Column({type: 'varchar'})
    type: string

    @Column({type: 'integer'})
    size: number

    @Column({type: 'boolean'})
    official: boolean

    @Column({type: "varchar"})
    published_at: string

    @ManyToOne(() => Movie, (movie) => movie.videos)
    movie: Movie
}

export default Video