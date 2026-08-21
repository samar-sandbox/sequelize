import { Comment } from "./comment.model.js";
import { Post } from "./post.model.js";
import { User } from "./user.model.js";

// User Associations
User.hasMany(Post, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: { allowNull: false },
});
User.hasMany(Comment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: { allowNull: false },
});

// Post Associations
Post.hasMany(Comment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: { allowNull: false },
});
Post.belongsTo(User);

// Comments Associations
Comment.belongsTo(Post);
Comment.belongsTo(User);

export { User, Post, Comment };
