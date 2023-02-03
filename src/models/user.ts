import { LANGUAGES } from '@constants'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity({
  name: 'user',
})
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  name?: string

  @Column({ nullable: false, type: 'varchar', unique: true})
  email: string

  @Column({ type: 'varchar'})
  password: string

  @Column({ nullable: false, type: 'varchar', unique: true})
  slug: string

  @Column({ type: 'varchar'})
  logo?: string

  @Column({ type: 'varchar'})
  language: LANGUAGES
}

export default User
