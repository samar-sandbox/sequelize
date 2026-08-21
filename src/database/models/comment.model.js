import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

// Comment model
export class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  { sequelize, modelName: "comment" },
);
