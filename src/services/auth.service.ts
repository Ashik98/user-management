import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User.entity';
import { RefreshToken } from '../entities/RefreshToken.entity';
import { AppError } from '../utils/AppError';
import { PasswordUtil } from '../utils/password.util';
import { JwtUtil } from '../utils/jwt.util';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

  async register(registerDto: RegisterDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Validate password strength
    const passwordValidation = PasswordUtil.validatePassword(registerDto.password);
    if (!passwordValidation.valid) {
      throw new AppError(passwordValidation.message!, 400);
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hash(registerDto.password);

    // Create user
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    return user;
  }

  async login(loginDto: LoginDto): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    // Find user
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('User account is deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = JwtUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = JwtUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken);

    return { user, accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // Verify refresh token
    const decoded = JwtUtil.verifyRefreshToken(refreshToken);

    // Check if refresh token exists and is not revoked
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, userId: decoded.userId },
    });

    if (!storedToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    if (storedToken.isRevoked) {
      throw new AppError('Refresh token has been revoked', 401);
    }

    if (new Date() > storedToken.expiresAt) {
      throw new AppError('Refresh token has expired', 401);
    }

    // Verify user still exists
    const user = await this.userRepository.findOne({
      where: { id: decoded.userId },
    });

    if (!user || !user.isActive) {
      throw new AppError('User no longer exists or is inactive', 401);
    }

    // Generate new tokens
    const newAccessToken = JwtUtil.generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const newRefreshToken = JwtUtil.generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    // Revoke old refresh token
    storedToken.isRevoked = true;
    await this.refreshTokenRepository.save(storedToken);

    // Store new refresh token
    await this.storeRefreshToken(user.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (storedToken) {
      storedToken.isRevoked = true;
      await this.refreshTokenRepository.save(storedToken);
    }
  }

  async clientCredentials(
    clientId: string,
    clientSecret: string,
  ): Promise<{ accessToken: string }> {
    // Verify client credentials
    if (
      clientId !== process.env.CLIENT_ID ||
      clientSecret !== process.env.CLIENT_SECRET
    ) {
      throw new AppError('Invalid client credentials', 401);
    }

    // Generate access token with limited scope
    const accessToken = JwtUtil.generateAccessToken({
      userId: 'client',
      email: 'client@system',
    });

    return { accessToken };
  }

  private async storeRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshToken);
  }
}
