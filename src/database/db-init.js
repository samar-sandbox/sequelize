import { Sequelize } from "sequelize";
import { dbOpt, DB_NAME } from "./db.js";

export async function createDatabase() {
  console.log("Creating database");

  const sequelize = new Sequelize(dbOpt);

  await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);

  await sequelize.close();

  console.log(`Database ${DB_NAME} created successfully`);
}
