import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne} from 'typeorm'
import Movie from './Movie'
import {MOVIE_LANGUAGE, MOVIE_VIDEO_TYPE} from "@constants";

@Entity({
    name: 'video',
})
class Video extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    // @Column({type: 'varchar', nullable: true})
    // movie_id: string

    @Column({type: 'varchar'})
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
    type: MOVIE_VIDEO_TYPE

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
