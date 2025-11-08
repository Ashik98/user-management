import { DataSource } from 'typeorm';
import { createDatabase } from 'typeorm-extension';
import logger from './logger';

export async function initializeDatabase() {
  const options = {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'motorola98',
    database: process.env.DB_DATABASE || 'user_management',
  };

  try {
    // Create database if it doesn't exist
    await createDatabase({
      options,
      ifNotExist: true,
    });
    
    logger.info(`✅ Database '${options.database}' is ready`);
  } catch (error: any) {
    // Check if error is because database already exists
    if (error.message?.includes('already exists')) {
      logger.info(`ℹ️ Database '${options.database}' already exists`);
    } else {
      logger.error('❌ Error creating database:', error);
      throw error;
    }
  }
}
