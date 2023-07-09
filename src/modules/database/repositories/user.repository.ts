import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column()
  email: string;

  @Column({ nullable: false })
  salt: string;

  @Column({ nullable: false })
  hashedPassword: string;

  @Column({ nullable: false })
  activated: boolean;
}
