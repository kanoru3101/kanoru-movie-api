import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity({
  name: 'log',
})
class Logs extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string

  @Column({ type: 'jsonb', nullable: false })
  public message?: JSON
}

export default Logs
