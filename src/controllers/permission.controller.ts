import { Request, Response } from 'express';
import { PermissionService } from '../services/permission.service';
import { asyncHandler } from '../utils/asyncHandler';

const permissionService = new PermissionService();

/**
 * @swagger
 * /permissions:
 *   get:
 *     tags: [Permissions]
 *     summary: Get all permissions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 */
export const getAllPermissions = asyncHandler(async (_req: Request, res: Response) => {
  const permissions = await permissionService.findAll();

  res.status(200).json({
    status: 'success',
    results: permissions.length,
    data: { permissions },
  });
});

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     tags: [Permissions]
 *     summary: Get permission by ID
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
 *         description: Permission data
 */
export const getPermissionById = asyncHandler(async (req: Request, res: Response) => {
  const permission = await permissionService.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { permission },
  });
});

/**
 * @swagger
 * /permissions:
 *   post:
 *     tags: [Permissions]
 *     summary: Create a new permission
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       201:
 *         description: Permission created successfully
 */
export const createPermission = asyncHandler(async (req: Request, res: Response) => {
  const permission = await permissionService.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Permission created successfully',
    data: { permission },
  });
});

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     tags: [Permissions]
 *     summary: Update permission
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
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       200:
 *         description: Permission updated successfully
 */
export const updatePermission = asyncHandler(async (req: Request, res: Response) => {
  const permission = await permissionService.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    message: 'Permission updated successfully',
    data: { permission },
  });
});

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     tags: [Permissions]
 *     summary: Delete permission
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
 *         description: Permission deleted successfully
 */
export const deletePermission = asyncHandler(async (req: Request, res: Response) => {
  await permissionService.delete(req.params.id);

  res.status(204).json({
    status: 'success',
    message: 'Permission deleted successfully',
  });
});

/**
 * @swagger
 * /permissions/assign:
 *   post:
 *     tags: [Permissions]
 *     summary: Assign permission to user
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
 *               - permissionId
 *             properties:
 *               userId:
 *                 type: string
 *               permissionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission assigned successfully
 */
export const assignPermissionToUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId, permissionId } = req.body;
  await permissionService.assignPermissionToUser(userId, permissionId);

  res.status(200).json({
    status: 'success',
    message: 'Permission assigned to user successfully',
  });
});

/**
 * @swagger
 * /permissions/remove:
 *   post:
 *     tags: [Permissions]
 *     summary: Remove permission from user
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
 *               - permissionId
 *             properties:
 *               userId:
 *                 type: string
 *               permissionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission removed successfully
 */
export const removePermissionFromUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId, permissionId } = req.body;
  await permissionService.removePermissionFromUser(userId, permissionId);

  res.status(200).json({
    status: 'success',
    message: 'Permission removed from user successfully',
  });
});
