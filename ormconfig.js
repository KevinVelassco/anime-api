const dotenv = require('dotenv');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'local';
const envFilePath = path.resolve(__dirname, `./.env.${NODE_ENV}`);

dotenv.config({ path: envFilePath });

module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations'
  }
};
