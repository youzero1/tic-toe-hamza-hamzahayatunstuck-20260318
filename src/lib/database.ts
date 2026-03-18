import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Game } from './entities/Game';
import path from 'path';
import fs from 'fs';

let dataSource: DataSource | null = null;

function getDbPath(): string {
  const dbPath = process.env.DATABASE_PATH || './data/tictactoe.db';
  const absolutePath = path.isAbsolute(dbPath)
    ? dbPath
    : path.join(process.cwd(), dbPath);
  
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  return absolutePath;
}

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = getDbPath();

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [Game],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();
  return dataSource;
}
