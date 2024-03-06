import "dotenv/config";

import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import { resolve } from "node:path";
import { authRoutes } from "./routes/auth";
import { friendsRoutes } from "./routes/friends";
import { postsRoutes } from "./routes/posts";
import { uploadRoutes } from "./routes/upload";

const app = fastify();

app.register(multipart);

app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: "sphere",
});

app.register(authRoutes);
app.register(uploadRoutes);
app.register(postsRoutes);
app.register(friendsRoutes);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("🚀 HTTP server running on port http://localhost:3333");
  });
