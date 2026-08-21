import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

// Post model
export class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Title cannot be empty" },
        notNull: { msg: "Title is required" },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Content cannot be empty" },
        notNull: { msg: "Content is required" },
      },
    },
  },
  { sequelize, modelName: "post", paranoid: true },
);
