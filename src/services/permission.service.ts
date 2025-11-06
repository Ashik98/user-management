import { AppDataSource } from '../ormconfig';
import { Permission } from '../entities/Permission.entity';
import { UserPermission } from '../entities/UserPermission.entity';
import { AppError } from '../utils/AppError';
import { CreatePermissionDto, UpdatePermissionDto } from '../dto/permission.dto';

export class PermissionService {
  private permissionRepository = AppDataSource.getRepository(Permission);
  private userPermissionRepository = AppDataSource.getRepository(UserPermission);

  async findAll(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }

  async findById(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({ where: { id } });

    if (!permission) {
      throw new AppError('Permission not found', 404);
    }

    return permission;
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const existingPermission = await this.permissionRepository.findOne({
      where: { name: createPermissionDto.name },
    });

    if (existingPermission) {
      throw new AppError('Permission with this name already exists', 409);
    }

    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({ where: { id } });

    if (!permission) {
      throw new AppError('Permission not found', 404);
    }

    if (updatePermissionDto.name && updatePermissionDto.name !== permission.name) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: updatePermissionDto.name },
      });

      if (existingPermission) {
        throw new AppError('Permission with this name already exists', 409);
      }
    }

    Object.assign(permission, updatePermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async delete(id: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({ where: { id } });

    if (!permission) {
      throw new AppError('Permission not found', 404);
    }

    await this.permissionRepository.remove(permission);
  }

  async assignPermissionToUser(userId: string, permissionId: string): Promise<UserPermission> {
    const existingUserPermission = await this.userPermissionRepository.findOne({
      where: { userId, permissionId },
    });

    if (existingUserPermission) {
      throw new AppError('User already has this permission', 409);
    }

    const userPermission = this.userPermissionRepository.create({ userId, permissionId });
    return await this.userPermissionRepository.save(userPermission);
  }

  async removePermissionFromUser(userId: string, permissionId: string): Promise<void> {
    const userPermission = await this.userPermissionRepository.findOne({
      where: { userId, permissionId },
    });

    if (!userPermission) {
      throw new AppError('User does not have this permission', 404);
    }

    await this.userPermissionRepository.remove(userPermission);
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    // Get direct user permissions
    const userPermissions = await this.userPermissionRepository.find({
      where: { userId },
      relations: ['permission'],
    });

    const directPermissions = userPermissions.map((up) => up.permission);

    // Get permissions from user roles
    const userRolePermissions = await AppDataSource.query(
      `
      SELECT DISTINCT p.*
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp."permissionId"
      INNER JOIN user_roles ur ON rp."roleId" = ur."roleId"
      WHERE ur."userId" = $1
    `,
      [userId],
    );

    // Combine and deduplicate permissions
    const allPermissions = [...directPermissions, ...userRolePermissions];
    const uniquePermissions = Array.from(
      new Map(allPermissions.map((p) => [p.id, p])).values(),
    );

    return uniquePermissions;
  }
}
