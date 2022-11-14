import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  name: 'postgres',
  type: 'postgres',
  host: process.env.DB_URL || '172.29.48.1',
  port: 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'mytunes2022',
  database: process.env.DB_NAME || 'mytunes',
  entities: [__dirname + '/persistence/entities/*.entity{.ts,.js}'],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
