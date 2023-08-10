import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from './rt.repository';

abstract class UserBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: false, name: 'via_google' })
  viaGoogle: boolean;

  @Column({ default: '' })
  picture: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.hashedRt, {
    nullable: true,
  })
  @JoinColumn({ name: 'hashedRt' })
  refreshToken: RefreshToken | null;
}

@Entity()
export class User extends UserBase {}
