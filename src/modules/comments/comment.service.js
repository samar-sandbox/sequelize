import { Op } from "sequelize";
import { Comment, Post, User } from "../../database/models/index.js";
import { getPostById } from "../posts/post.service.js";
import { getUserById } from "../users/user.service.js";

export async function createCommentBulk(commentsData) {
  if (!commentsData || !commentsData.comments) {
    return { error: "Invalid comments data", status: 400 };
  }

  const { comments } = commentsData;
  if (comments.length === 0) {
    return { error: "No comments to add", status: 400 };
  }

  await Promise.all(
    comments.map(async ({ userId, postId }, index) => {
      if (!userId) {
        throw new Error(`Comment ${index + 1}: User ID is required`);
      }

      if (!postId) {
        throw new Error(`Comment ${index + 1}: Post ID is required`);
      }

      const userResult = await getUserById(userId);
      if (userResult.error) {
        throw new Error(`Comment ${index + 1}: ${userResult.error}`);
      }

      const postResult = await getPostById(postId);
      if (postResult.error) {
        throw new Error(`Comment ${index + 1}: ${postResult.error}`);
      }
    }),
  );

  const commentsCreated = await Comment.bulkCreate(comments, {
    validate: true,
  });

  return { message: "Comments created successfully", data: commentsCreated };
}

export async function updateComment(id, commentData) {
  if (!commentData) {
    return { error: "Invalid comment data", status: 400 };
  }

  const commentId = parseInt(id);
  if (isNaN(commentId)) {
    return { error: "Invalid comment ID", status: 400 };
  }

  const { content, userId: userIdStr } = commentData;

  if (!userIdStr) {
    return { error: "User ID is required", status: 400 };
  }

  const userId = parseInt(userIdStr);

  if (isNaN(userId)) {
    return { error: "Invalid user ID", status: 400 };
  }

  const comment = await Comment.findByPk(commentId, { attributes: ["userId"] });

  if (!comment) {
    return { error: "Comment not found", status: 404 };
  }

  if (comment.userId !== userId) {
    return {
      error: "You are not authorized to update this comment",
      status: 403,
    };
  }

  await Comment.update({ content }, { where: { id: commentId } });

  return { message: "Comment updated successfully" };
}

export async function findOrCreate(commentData) {
  if (!commentData) {
    return { error: "Invalid comment data", status: 400 };
  }

  const { postId, userId, content } = commentData;

  if (!userId) {
    return { error: "User ID is required", status: 400 };
  }

  if (!postId) {
    return { error: "Post ID ID is required", status: 400 };
  }

  if (!content) {
    return { error: "Content is required", status: 400 };
  }

  const userResult = await getUserById(userId);
  if (userResult.error) {
    return userResult;
  }

  const postResult = await getPostById(postId);
  if (postResult.error) {
    return postResult;
  }

  const [comment, isNewRecord] = await Comment.findOrCreate({
    where: { content, postId, userId },
  });

  return {
    message: `Comment ${isNewRecord ? "created" : "found"} successfully`,
    data: comment,
    isNewRecord,
  };
}

export async function searchAndCount(keyword = "") {
  const { rows: comments, count } = await Comment.findAndCountAll({
    where: {
      content: { [Op.substring]: keyword },
    },
  });

  if (!count) {
    return { message: "No comments found" };
  }

  return { message: "Comments found successfully", count, comments };
}

export async function getPostRecentComments(postId) {
  const postResult = await getPostById(postId);
  if (postResult.error) {
    return postResult;
  }

  const comments = await Comment.findAll({
    where: { postId },
    order: [["createdAt", "DESC"]],
    limit: 3,
    attributes: ["id", "content", "createdAt"],
  });

  return { message: "Comments retrieved successfully", data: comments };
}

export async function getCommentById(id) {
  const commentId = parseInt(id);

  if (isNaN(commentId)) {
    return { error: "Invalid comment ID", status: 400 };
  }

  const comment = await Comment.findByPk(commentId, {
    attributes: ["id", "content"],
    include: [
      { model: User, attributes: ["id", "name", "email"] },
      { model: Post, attributes: ["id", "title", "content"] },
    ],
  });

  if (!comment) {
    return { error: "Comment not found", status: 404 };
  }

  return { message: "Comment retrieved successfully", data: comment };
}
