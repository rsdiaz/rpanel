import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

export interface ProjectRecord {
  id: string;
  name: string;
  config: string;
}

export class ProjectManager {
  private db: any;

  constructor(pathToDb: string = "./data.sqlite") {
    const migrationsPath = path.resolve(__dirname, "../db/migrations.sql");
    const migrationSQL = fs.readFileSync(migrationsPath, "utf-8");

    this.db = new Database(pathToDb);
    this.db.exec(migrationSQL);
  }

  createApp(name: string, config: object) {
    const id = randomUUID();
    const stmt = this.db.prepare(
      "INSERT INTO apps (id, name, config) VALUES (?, ?, ?)"
    );
    stmt.run(id, name, JSON.stringify(config));
  }

  updateApp(id: string, config: ProjectRecord["config"]) {
    const stmt = this.db.prepare("UPDATE apps SET config = ? WHERE id = ?");
    stmt.run(JSON.stringify(config), id);
  }

  listApps(): ProjectRecord[] {
    const rows = this.db.prepare("SELECT * FROM apps").all();

    return rows.map((row: any) => ({
      ...row,
      config: JSON.parse(row.config),
    }));
  }

  deleteApp(id: string) {
    this.db.prepare("DELETE FROM apps WHERE id = ?").run(id);
  }

  findAppByName(name: string): ProjectRecord | undefined {
    return this.db.prepare("SELECT * FROM apps WHERE name = ?").get(name);
  }
}
