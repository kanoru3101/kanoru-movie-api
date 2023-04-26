import {MOVIE_LANGUAGE} from '@constants/index'
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn, Unique
} from 'typeorm'
import Cast from "./Cast";

@Entity({
    name: 'person',
})
@Unique(['language', 'tmdb_id', 'imdb_id'])
class Person extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'varchar'})
    language: MOVIE_LANGUAGE

    @Column({ type: 'integer', nullable: false})
    tmdb_id: number

    @Column({ type: 'varchar', nullable: false})
    imdb_id: string

    @Column({ type: 'varchar', nullable: false })
    name: string

    @Column({ type: 'varchar', nullable: false })
    biography: string

    @Column({ type: 'integer', default: 0 })
    gender: number

    @Column({ type: 'real' })
    popularity: number

    @Column({ type: 'varchar', nullable: true })
    place_of_birth: string | null

    @Column({ type: 'varchar', nullable: true })
    profile_path: string | null

    @Column({ type: 'boolean' })
    adult: boolean

    @Column({ type: 'varchar', nullable: true })
    homepage: string | null

    @Column({ type: 'text', array: true, default: [] })
    also_known_as: string[]

    @CreateDateColumn({ type: "timestamp", default: () => "current_timestamp" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "current_timestamp", onUpdate: "current_timestamp" })
    public updated_at: Date;

    @OneToMany(() => Cast, (cast) => cast.person)
    cast: Cast[];
}

export default Person
