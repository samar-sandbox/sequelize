import { DataTypes, DATE } from "sequelize";
import { sequelize } from "../db.js";

// User model
export const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name cannot be empty" },
      notNull: { msg: "Name is required" },
    },
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: { msg: "Email must be a valid email address" },
      notNull: { msg: "Email is required" },
    },
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notNull: { msg: "Password is required" },
      checkPasswordLength(value) {
        if (value.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
      },
    },
  },
  role: {
    type: DataTypes.ENUM("user", "admin"),
    defaultValue: "user",
    allowNull: false,
    validate: {
      isValid(value) {
        if (!["user", "admin"].includes(value)) {
          throw new Error("Invalid role value");
        }
      },
    },
  },
});

// Hooks
User.addHook("beforeCreate", function checkNameLength(user) {
  if (user.name.length < 3) {
    throw new Error("Name must be at least 3 characters long");
  }
});
