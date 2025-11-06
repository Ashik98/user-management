import { AppDataSource } from '../ormconfig';
import { User } from '../entities/User.entity';
import { AppError } from '../utils/AppError';
import { PasswordUtil } from '../utils/password.util';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

export class UserService {
  private userRepository = AppDataSource.getRepository(User);

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
  const existingUser = await this.userRepository.findOne({
    where: { email: createUserDto.email },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const passwordValidation = PasswordUtil.validatePassword(createUserDto.password);
  if (!passwordValidation.valid) {
    throw new AppError(passwordValidation.message!, 400);
  }

  const hashedPassword = await PasswordUtil.hash(createUserDto.password);

  const user = this.userRepository.create({
    ...createUserDto,
    password: hashedPassword,
  });

  await this.userRepository.save(user);

  const { password, ...safeUser } = user;
  return safeUser;
}


  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
  const user = await this.userRepository.findOne({ where: { id } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (updateUserDto.email && updateUserDto.email !== user.email) {
    const existingUser = await this.userRepository.findOne({
      where: { email: updateUserDto.email },
    });

    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }
  }

  Object.assign(user, updateUserDto);
  await this.userRepository.save(user);

  const { password, ...safeUser } = user;
  return safeUser;
}


  async delete(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.userRepository.remove(user);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isPasswordValid = await PasswordUtil.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    const passwordValidation = PasswordUtil.validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new AppError(passwordValidation.message!, 400);
    }

    user.password = await PasswordUtil.hash(newPassword);
    await this.userRepository.save(user);
  }
}
