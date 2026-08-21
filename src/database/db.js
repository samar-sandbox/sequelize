import { Sequelize } from "sequelize";
import config from "../config/config.js";

export const DB_NAME = config.dbName;

export const dbOpt = {
  dialect: "mysql",
  username: config.dbUser,
  password: config.dbPassword,
  logging: false,
};

export const sequelize = new Sequelize({
  ...dbOpt,
  database: config.dbName,
});

export async function connectDatabase() {
  console.log(`Testing database connection`);

  await sequelize.authenticate();

  console.log("Syncing all defined models to the DB");

  await sequelize.sync({ alter: true });

  console.log("Database initialized successfully");
}
