import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('personas')
export class Persona {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'nvarchar', length: 100 })
  nombre!: string;

  @Column({ type: 'nvarchar', length: 100 })
  apellidos!: string;

  @Column({ type: 'nvarchar', length: 150, unique: true })
  email!: string;

  @Column({ type: 'nvarchar', length: 20, nullable: true })
  telefono!: string | null;

  @Column({ type: 'date', nullable: true, name: 'fecha_nacimiento' })
  fechaNacimiento!: string | null;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  direccion!: string | null;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  foto!: string | null;

  @Column({ type: 'bit', default: true })
  activo!: boolean;

  @CreateDateColumn({ type: 'datetime2', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime2', name: 'updated_at' })
  updatedAt!: Date;
}
