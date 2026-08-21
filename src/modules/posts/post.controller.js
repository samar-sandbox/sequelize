import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostsDetails,
  getPostWithCommentsCount,
} from "./post.service.js";

const router = Router();

// Create new Post
router.post("/", async (req, res) => {
  const postData = req.body;

  const result = await createPost(postData);

  if (result.data) {
    return res.status(201).json({ success: true, ...result });
  }

  return res
    .status(result.status)
    .json({ success: false, message: result.error });
});

// Delete Post
router.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  const userId = req.query.userId;

  const result = await deletePost(postId, userId);

  if (result.error) {
    return res
      .status(result.status)
      .json({ success: false, message: result.error });
  }

  return res.status(200).json({ success: true, ...result });
});

// Get all posts, including the details of the user who created each post and the associated comments
router.get("/details", async (req, res) => {
  const result = await getPostsDetails();

  return res.status(200).json({ success: true, ...result });
});

// Get all posts and count the number of comments associated with each post
router.get("/comment-count", async (req, res) => {
  const result = await getPostWithCommentsCount();

  return res.status(200).json({ success: true, ...result });
});

export default router;
