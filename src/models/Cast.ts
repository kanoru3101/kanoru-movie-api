import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn, Unique, ManyToOne
} from 'typeorm'
import Person from "./Person";
import Movie from "./Movie";


@Entity({
    name: 'cast',
})
@Unique(['credit_id', 'person.id'])
@Unique(['credit_id', 'movie.id'])
@Unique(['credit_id', 'person.id', 'movie.id'])
class Cast extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar'})
    credit_id: string

    @Column({ type: 'integer' })
    order: number

    @Column({ type: 'varchar', nullable: false })
    character: string

    @Column({ type: 'integer', nullable: true })
    gender: number | null

    @Column({ type: 'boolean' })
    adult: boolean

    @Column({ type: 'varchar' })
    known_for_department: string

    @Column({ type: 'integer'})
    cast_id: number

    @CreateDateColumn({ type: "timestamp", default: () => "current_timestamp" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "current_timestamp", onUpdate: "current_timestamp" })
    public updated_at: Date;

    @ManyToOne(() => Movie, (movie) => movie.cast, { cascade: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
    movie: Movie
    //
    @ManyToOne(() => Person, (person) => person.cast, { cascade: true, onUpdate: "CASCADE", onDelete: "CASCADE"})
    person: Person
}

export default Cast
