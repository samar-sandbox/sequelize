import { Router } from "express";
import { Comment } from "../../database/models/index.js";
import {
  createCommentBulk,
  findOrCreate,
  getCommentById,
  getPostRecentComments,
  searchAndCount,
  updateComment,
} from "./comment.service.js";

const router = Router();

// Create a bulk of Comments
router.post("/", async (req, res) => {
  const result = await createCommentBulk(req.body);

  if (result.data) {
    return res.status(200).json({ success: true, ...result });
  }

  return res
    .status(result.status)
    .json({ success: false, message: result.error });
});

// Update the content of a specific comment by its ID
router.patch("/:id", async (req, res) => {
  const commentId = req.params.id;
  const commentData = req.body;

  const result = await updateComment(commentId, commentData);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

// Find a comment for a specific post, user, and content or create a new one if not found
router.post("/find-or-create", async (req, res) => {
  const commentData = req.body;

  const result = await findOrCreate(commentData);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res
    .status(result.isNewRecord ? 201 : 200)
    .json({ success: true, ...result });
});

// Find all comments that contain a specific word in their content and return the number of comments matched
router.get("/search", async (req, res) => {
  const word = req.query.word;

  const result = await searchAndCount(word);

  return res.status(200).json({ success: true, ...result });
});

// Find the 3 most recent comments for a specific post, ordered by creation date
router.get("/newest/:postId", async (req, res) => {
  const postId = req.params.postId;

  const result = await getPostRecentComments(postId);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

// Get comment by ID with user and post information
router.get("/details/:id", async (req, res) => {
  const commentId = req.params.id;

  const result = await getCommentById(commentId);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

export default router;
