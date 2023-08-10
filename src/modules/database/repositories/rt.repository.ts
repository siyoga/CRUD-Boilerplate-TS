import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.repository';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  hashedRt: string;

  @OneToOne(() => User, (user) => user.refreshToken)
  @JoinColumn({ name: 'id' })
  user: User;
}
