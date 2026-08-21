import express from "express";
import errorHandler from "./middlewares/error-handler.middleware.js";
import config from "./config/config.js";
import { createDatabase } from "./database/db-init.js";
import { connectDatabase } from "./database/db.js";
import {
  commentController,
  postController,
  userController,
} from "./modules/index.js";

const port = config.port;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "Retail Store API is running" });
});

app.use("/users", userController);
app.use("/posts", postController);
app.use("/comments", commentController);

app.use("/*splat", (req, res) => {
  const path = req.params.splat;
  const method = req.method;

  return res.status(404).json({
    success: false,
    message: `Route ${method} ${path.join("/")} not found`,
  });
});

app.use(errorHandler);

createDatabase().then(() =>
  connectDatabase()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((error) => {
      console.log(`Error initializing database: ${error}`);
    }),
);
