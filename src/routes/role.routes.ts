import { Router } from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignRoleToUser,
  removeRoleFromUser,
  assignPermissionToRole,
  removePermissionFromRole,
} from '../controllers/role.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/rbac.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateRoleDto, UpdateRoleDto, AssignRoleDto } from '../dto/role.dto';

const router = Router();

// All role routes require authentication
router.use(authenticate);

router.get('/', requirePermission('roles.read'), getAllRoles);
router.get('/:id', requirePermission('roles.read'), getRoleById);
router.post('/', requirePermission('roles.create'), validateDto(CreateRoleDto), createRole);
router.put('/:id', requirePermission('roles.update'), validateDto(UpdateRoleDto), updateRole);
router.delete('/:id', requirePermission('roles.delete'), deleteRole);

router.post('/assign', requirePermission('roles.assign'), validateDto(AssignRoleDto), assignRoleToUser);
router.post('/remove', requirePermission('roles.assign'), validateDto(AssignRoleDto), removeRoleFromUser);

router.post('/assign-permission', requirePermission('roles.update'), assignPermissionToRole);
router.post('/remove-permission', requirePermission('roles.update'), removePermissionFromRole);

export default router;
