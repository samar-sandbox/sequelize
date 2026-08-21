import { Router } from "express";
import { User } from "../../database/models/index.js";
import {
  createUser,
  createOrUpdateUser,
  getUserByEmail,
  getUserById,
} from "./user.service.js";

const router = Router();

// Create a new user
router.post("/signup", async (req, res) => {
  const userData = req.body;

  const result = await createUser(userData);

  if (result.data) {
    return res.status(201).json({ success: true, ...result });
  }

  return res
    .status(result.status)
    .json({ success: false, message: result.error });
});

// Create or update user
router.put("/:id", async (req, res) => {
  const userData = req.body;
  const userId = req.params.id;

  const result = await createOrUpdateUser(userId, userData);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res
    .status(result.isNewRecord ? 201 : 200)
    .json({ success: true, ...result });
});

// Get user by their email address
router.get("/by-email", async (req, res) => {
  const email = req.query.email;

  const result = await getUserByEmail(email);

  if (result.data) {
    return res.status(200).json({ success: true, ...result });
  }

  return res
    .status(result.status)
    .json({ success: false, message: result.error });
});

// Get user by their ID
router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  const result = await getUserById(userId);

  if (result.data) {
    return res.status(200).json({ success: true, ...result });
  }

  return res
    .status(result.status)
    .json({ success: false, message: result.error });
});

export default router;
