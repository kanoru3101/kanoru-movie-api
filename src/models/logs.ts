import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity({
  name: 'logs',
})
class Logs extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: string

  @Column({ type: 'jsonb', nullable: false })
  public message?: JSON
}

export default Logs
