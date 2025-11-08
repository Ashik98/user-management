import { AppDataSource } from '../config/data-source';
import { Role } from '../entities/Role.entity';
import { UserRole } from '../entities/UserRole.entity';
import { RolePermission } from '../entities/RolePermission.entity';
import { AppError } from '../utils/AppError';
import { CreateRoleDto, UpdateRoleDto } from '../dto/role.dto';

export class RoleService {
  private roleRepository = AppDataSource.getRepository(Role);
  private userRoleRepository = AppDataSource.getRepository(UserRole);
  private rolePermissionRepository = AppDataSource.getRepository(RolePermission);

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });
  }

  async findById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    return role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new AppError('Role with this name already exists', 409);
    }

    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new AppError('Role with this name already exists', 409);
      }
    }

    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  async delete(id: string): Promise<void> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new AppError('Role not found', 404);
    }

    await this.roleRepository.remove(role);
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<UserRole> {
    const existingUserRole = await this.userRoleRepository.findOne({
      where: { userId, roleId },
    });

    if (existingUserRole) {
      throw new AppError('User already has this role', 409);
    }

    const userRole = this.userRoleRepository.create({ userId, roleId });
    return await this.userRoleRepository.save(userRole);
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const userRole = await this.userRoleRepository.findOne({
      where: { userId, roleId },
    });

    if (!userRole) {
      throw new AppError('User does not have this role', 404);
    }

    await this.userRoleRepository.remove(userRole);
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });

    return userRoles.map((ur) => ur.role);
  }

  async assignPermissionToRole(roleId: string, permissionId: string): Promise<RolePermission> {
    const existingRolePermission = await this.rolePermissionRepository.findOne({
      where: { roleId, permissionId },
    });

    if (existingRolePermission) {
      throw new AppError('Role already has this permission', 409);
    }

    const rolePermission = this.rolePermissionRepository.create({ roleId, permissionId });
    return await this.rolePermissionRepository.save(rolePermission);
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    const rolePermission = await this.rolePermissionRepository.findOne({
      where: { roleId, permissionId },
    });

    if (!rolePermission) {
      throw new AppError('Role does not have this permission', 404);
    }

    await this.rolePermissionRepository.remove(rolePermission);
  }
}
