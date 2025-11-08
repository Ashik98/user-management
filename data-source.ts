import { config } from 'dotenv';
config();

// Import and re-export for CLI usage
import { AppDataSource } from './src/config/data-source';
export default AppDataSource;
