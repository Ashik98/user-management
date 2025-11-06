import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
  clientCredentials,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { RegisterDto, LoginDto, RefreshTokenDto, ClientCredentialsDto } from '../dto/auth.dto';

const router = Router();

router.post('/register', validateDto(RegisterDto), register);
router.post('/login', validateDto(LoginDto), login);
router.post('/refresh', validateDto(RefreshTokenDto), refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getCurrentUser);
router.post('/token', validateDto(ClientCredentialsDto), clientCredentials);

export default router;
