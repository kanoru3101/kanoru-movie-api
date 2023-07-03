import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from 'typeorm'
import {WORKER_NAME, WORKER_STATUS} from "@constants";

type WorkerDataState = {
  total: number
  progress: number,
  movies: number,
  people: number,
  cast: number,
  videos: number
}

@Entity({
  name: 'worker',
})
class Worker extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', nullable: false})
  name: WORKER_NAME

  @Column({ type: 'varchar', nullable: false, default: WORKER_STATUS.CREATED})
  status: WORKER_STATUS

  @Column({ type: 'jsonb', default: {} })
  public data?: Record<string, any> | WorkerDataState

  @CreateDateColumn({ type: "varchar", default: null })
  public started_at?: string;

  @CreateDateColumn({ type: "varchar",  default: null })
  public finished_at?: string;

  @CreateDateColumn({ type: "timestamp", default: () => "current_timestamp" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "current_timestamp", onUpdate: "current_timestamp" })
  public updated_at: Date;
}

export default Worker
