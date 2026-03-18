import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  winner!: string;

  @Column({ type: 'text' })
  board!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
