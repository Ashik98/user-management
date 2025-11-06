import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/rbac.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from '../dto/user.dto';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/', requirePermission('users.read'), getAllUsers);
router.get('/:id', requirePermission('users.read'), getUserById);
router.post('/', requirePermission('users.create'), validateDto(CreateUserDto), createUser);
router.put('/:id', requirePermission('users.update'), validateDto(UpdateUserDto), updateUser);
router.delete('/:id', requirePermission('users.delete'), deleteUser);
router.post(
  '/:id/change-password',
  authenticate,
  validateDto(ChangePasswordDto),
  changePassword,
);

export default router;
