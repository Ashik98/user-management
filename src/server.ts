import 'reflect-metadata';
import { config } from 'dotenv';
config();

import app from './app';
import { AppDataSource } from './config/data-source';  // ← Updated
import { initializeDatabase } from './config/init-database';
import logger from './config/logger';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Step 1: Create database if it doesn't exist
    logger.info('🔍 Checking database...');
    await initializeDatabase();

    // Step 2: Initialize Database Connection
    logger.info('🔌 Connecting to database...');
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    logger.info('✅ Database connection established successfully');

    // Step 3: Run migrations (if enabled)
    if (process.env.RUN_MIGRATIONS === 'true') {
      logger.info('🔄 Running migrations...');
      await AppDataSource.runMigrations();
      logger.info('✅ Migrations completed');
    }

    // Step 4: Start Express Server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 Swagger Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

startServer();
