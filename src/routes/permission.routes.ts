import { Router } from 'express';
import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  assignPermissionToUser,
  removePermissionFromUser,
} from '../controllers/permission.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/rbac.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreatePermissionDto, UpdatePermissionDto, AssignPermissionDto } from '../dto/permission.dto';

const router = Router();

// All permission routes require authentication
router.use(authenticate);

router.get('/', requirePermission('permissions.read'), getAllPermissions);
router.get('/:id', requirePermission('permissions.read'), getPermissionById);
router.post('/', requirePermission('permissions.create'), validateDto(CreatePermissionDto), createPermission);
router.put('/:id', requirePermission('permissions.update'), validateDto(UpdatePermissionDto), updatePermission);
router.delete('/:id', requirePermission('permissions.delete'), deletePermission);

router.post('/assign', requirePermission('permissions.assign'), validateDto(AssignPermissionDto), assignPermissionToUser);
router.post('/remove', requirePermission('permissions.assign'), validateDto(AssignPermissionDto), removePermissionFromUser);

export default router;
