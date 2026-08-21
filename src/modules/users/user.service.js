import { User } from "../../database/models/user.model.js";

export async function createUser(userData) {
  if (!userData) {
    return { error: "Invalid user data", status: 400 };
  }

  const { name, email, password, role } = userData;

  if (email) {
    const existingUser = await User.findOne({
      where: { email },
      attributes: ["id"],
    });

    if (existingUser) {
      return { error: "Email already exists", status: 409 };
    }
  }

  const user = User.build({ name, email, password, role });
  await user.save();

  return { message: "User created successfully", data: user };
}

export async function createOrUpdateUser(id, userData) {
  if (!userData) {
    return { error: "Invalid user data", status: 400 };
  }

  const userId = parseInt(id);

  if (isNaN(userId)) {
    return { error: "Invalid user ID", status: 400 };
  }

  const { name, email, password, role } = userData;

  if (email) {
    const existingUser = await User.findOne({
      where: { email },
      attributes: ["id"],
    });

    if (existingUser && existingUser.id !== userId) {
      return { error: "Email already exists", status: 409 };
    }
  }

  const [user, isNewRecord] = await User.upsert(
    { id: userId, name, email, password, role },
    { validate: false, fields: ["name", "email", "password", "role"] },
  );

  return {
    isNewRecord,
    message: `User ${isNewRecord ? "created" : "updated"} successfully`,
  };
}

export async function getUserByEmail(email) {
  if (!email) {
    return { error: "Email query parameter is required", status: 400 };
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return { error: "User not found", status: 404 };
  }

  return { message: "User retrieved successfully", data: user };
}

export async function getUserById(id) {
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return { error: "Invalid user ID", status: 400 };
  }

  const user = await User.findByPk(userId, {
    attributes: { exclude: ["role"] },
  });

  if (!user) {
    return { error: "User not found", status: 404 };
  }

  return { message: "User retrieved successfully", data: user };
}
