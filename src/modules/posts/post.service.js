import { Comment, Post, User } from "../../database/models/index.js";
import { getUserById } from "../users/user.service.js";

export async function createPost(postData) {
  if (!postData) {
    return { error: "Invalid post data", status: 400 };
  }

  const { title, content, userId } = postData;

  if (!userId) {
    return { error: "User ID is required", status: 400 };
  }

  const result = await getUserById(userId);
  if (result.error) {
    return result;
  }

  const post = new Post({ title, content, userId });
  await post.save();

  return { message: "Post created successfully", data: post };
}

export async function deletePost(id, userId) {
  const postId = parseInt(id);

  if (isNaN(postId)) {
    return { error: "Invalid post ID", status: 400 };
  }

  if (!userId) {
    return { error: "User ID is required", status: 400 };
  }

  userId = parseInt(userId);

  if (isNaN(userId)) {
    return { error: "Invalid user ID", status: 400 };
  }

  const post = await Post.findByPk(postId, { attributes: ["userId"] });

  if (!post) {
    return { error: "Post not found", status: 404 };
  }

  if (post.userId !== userId) {
    return { error: "You are not authorized to delete this post", status: 403 };
  }

  await Post.destroy({ where: { id: postId } });

  return { message: "Post deleted successfully" };
}

export async function getPostsDetails() {
  const posts = await Post.findAll({
    attributes: ["id", "title"],
    include: [
      { model: User, attributes: ["id", "name"] },
      { model: Comment, attributes: ["id", "content"] },
    ],
  });

  return { message: "Posts retrieved successfully", data: posts };
}

export async function getPostWithCommentsCount() {
  const posts = await Post.findAll({
    attributes: ["id", "title"],
    include: [{ model: Comment, attributes: ["id"] }],
  });

  const postsWithCount = posts.map(({ id, title, comments }) => ({
    id,
    title,
    commentCount: comments.length,
  }));

  return { message: "Posts retrieved successfully", data: postsWithCount };
}

export async function getPostById(id) {
  const postId = parseInt(id);

  if (isNaN(postId)) {
    return { error: "Invalid post ID", status: 400 };
  }

  const post = await Post.findByPk(postId, { attributes: ["id"] });

  if (!post) {
    return { error: "Post not found", status: 404 };
  }

  return { message: "Post retrieved successfully", data: post };
}
