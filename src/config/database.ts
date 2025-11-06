import { DataSource } from 'typeorm';
import { AppDataSource } from '../ormconfig';

export const getDataSource = (): DataSource => {
  return AppDataSource;
};

export const initializeDatabase = async (): Promise<void> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
};

export default AppDataSource;
