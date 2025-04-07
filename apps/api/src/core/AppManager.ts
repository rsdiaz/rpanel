import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export interface AppRecord {
  id: string;
  name: string;
  config: string;
}

export class AppManager {
  private db: any;

  constructor(pathToDb: string = './data.sqlite') {
    const migrationsPath = path.resolve(__dirname, '../db/migrations.sql');
    const migrationSQL = fs.readFileSync(migrationsPath, 'utf-8');

    this.db = new Database(pathToDb);
    this.db.exec(migrationSQL);
  }

  createApp(id: string, name: string, config: object) {
    const stmt = this.db.prepare('INSERT INTO apps (id, name, config) VALUES (?, ?, ?)');
    stmt.run(id, name, JSON.stringify(config));
  }

  listApps(): AppRecord[] {
    return this.db.prepare('SELECT * FROM apps').all();
  }

  deleteApp(id: string) {
    this.db.prepare('DELETE FROM apps WHERE id = ?').run(id);
  }

  findAppByName(name: string): AppRecord | undefined {
    return this.db.prepare('SELECT * FROM apps WHERE name = ?').get(name);
  }
}