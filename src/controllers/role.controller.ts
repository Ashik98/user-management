import { Request, Response } from 'express';
import { RoleService } from '../services/role.service';
import { asyncHandler } from '../utils/asyncHandler';

const roleService = new RoleService();

/**
 * @swagger
 * /roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
export const getAllRoles = asyncHandler(async (_req: Request, res: Response) => {
  const roles = await roleService.findAll();

  res.status(200).json({
    status: 'success',
    results: roles.length,
    data: { roles },
  });
});

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: Get role by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role data
 */
export const getRoleById = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { role },
  });
});

/**
 * @swagger
 * /roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       201:
 *         description: Role created successfully
 */
export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Role created successfully',
    data: { role },
  });
});

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     tags: [Roles]
 *     summary: Update role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const role = await roleService.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Role updated successfully',
    data: { role },
  });
});

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Role deleted successfully
 */
export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  await roleService.delete(req.params.id);

  res.status(204).json({
    status: 'success',
    message: 'Role deleted successfully',
  });
});

/**
 * @swagger
 * /roles/assign:
 *   post:
 *     tags: [Roles]
 *     summary: Assign role to user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roleId
 *             properties:
 *               userId:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role assigned successfully
 */
export const assignRoleToUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId, roleId } = req.body;
  await roleService.assignRoleToUser(userId, roleId);

  res.status(200).json({
    status: 'success',
    message: 'Role assigned to user successfully',
  });
});

/**
 * @swagger
 * /roles/remove:
 *   post:
 *     tags: [Roles]
 *     summary: Remove role from user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roleId
 *             properties:
 *               userId:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role removed successfully
 */
export const removeRoleFromUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId, roleId } = req.body;
  await roleService.removeRoleFromUser(userId, roleId);

  res.status(200).json({
    status: 'success',
    message: 'Role removed from user successfully',
  });
});

/**
 * @swagger
 * /roles/assign-permission:
 *   post:
 *     tags: [Roles]
 *     summary: Assign permission to role
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *               - permissionId
 *             properties:
 *               roleId:
 *                 type: string
 *               permissionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission assigned to role successfully
 */
export const assignPermissionToRole = asyncHandler(async (req: Request, res: Response) => {
  const { roleId, permissionId } = req.body;
  await roleService.assignPermissionToRole(roleId, permissionId);

  res.status(200).json({
    status: 'success',
    message: 'Permission assigned to role successfully',
  });
});

/**
 * @swagger
 * /roles/remove-permission:
 *   post:
 *     tags: [Roles]
 *     summary: Remove permission from role
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *               - permissionId
 *             properties:
 *               roleId:
 *                 type: string
 *               permissionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission removed from role successfully
 */
export const removePermissionFromRole = asyncHandler(async (req: Request, res: Response) => {
  const { roleId, permissionId } = req.body;
  await roleService.removePermissionFromRole(roleId, permissionId);

  res.status(200).json({
    status: 'success',
    message: 'Permission removed from role successfully',
  });
});
