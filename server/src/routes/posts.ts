import { Like } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function postsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/posts", async (request) => {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            user: {
              followers: {
                some: {},
              },
            },
          },
          {
            userId: request.user.sub,
          },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        likes: true,
      },
    });

    return posts.map(
      (post: {
        id: string;
        userName: string;
        userId: string;
        avatarUrl: string;
        content: string;
        postImageUrl: string | null;
        likes: Like[];
        createdAt: Date;
      }) => {
        return {
          id: post.id,
          userName: post.userName,
          userId: post.userId,
          avatarUrl: post.avatarUrl,
          content: post.content,
          postImageUrl: post.postImageUrl,
          likes: post.likes.length,
          userIdLiked: post.likes,
          createdAt: post.createdAt,
        };
      }
    );
  });

  app.get("/posts/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const posts = await prisma.post.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        likes: true,
      },
    });

    return posts.map(
      (post: {
        id: string;
        userName: string;
        userId: string;
        avatarUrl: string;
        content: string;
        postImageUrl: string | null;
        likes: Like[];
        createdAt: Date;
      }) => {
        return {
          id: post.id,
          userName: post.userName,
          userId: post.userId,
          avatarUrl: post.avatarUrl,
          content: post.content,
          postImageUrl: post.postImageUrl,
          likes: post.likes.length,
          userIdLiked: post.likes,
          createdAt: post.createdAt,
        };
      }
    );
  });

  app.post("/post", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      postImageUrl: z.string(),
      userName: z.string(),
      avatarUrl: z.string(),
      createdAt: z.string(),
    });

    const { content, postImageUrl, userName, avatarUrl, createdAt } =
      bodySchema.parse(request.body);

    const post = await prisma.post.create({
      data: {
        content,
        postImageUrl,
        userName,
        avatarUrl,
        userId: request.user.sub,
        createdAt,
      },
    });

    return post;
  });

  app.delete("/post/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (post.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });
  });

  app.post("/post/like/:id", async (request, reply) => {
    const bodySchema = z.object({
      userName: z.string(),
      avatarUrl: z.string(),
    });

    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const { userName, avatarUrl } = bodySchema.parse(request.body);

    const liked = await prisma.like.findFirst({
      where: {
        userId: request.user.sub,
        postId: id,
      },
    });

    if (liked) {
      return await prisma.like.delete({
        where: {
          id: liked.id,
        },
      });
    }

    const like = await prisma.like.create({
      data: {
        userId: request.user.sub,
        postId: id,
        userName,
        avatarUrl,
      },
    });

    return like;
  });
}
