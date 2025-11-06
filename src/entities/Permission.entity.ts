import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserPermission } from './UserPermission.entity';
import { RolePermission } from './RolePermission.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_permission_name')
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserPermission, (userPermission) => userPermission.permission, {
    cascade: true,
  })
  userPermissions: UserPermission[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission, {
    cascade: true,
  })
  rolePermissions: RolePermission[];
}
