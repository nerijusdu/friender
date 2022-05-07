import type { User, Post, Comment } from '@prisma/client';

import { prisma } from '~/db.server';
import type { UserMin } from './user.server';

export type { Post } from '@prisma/client';

export type CommentMin = {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export type PostMin = Pick<Post, 'id' | 'title' | 'body' | 'createdAt' | 'updatedAt'> & {
  user: UserMin;
  comments?: CommentMin[];
}

export function createPost({
  body,
  title,
  userId,
}: Pick<Post, 'body' | 'title'> & {
  userId: User['id'];
}) {
  return prisma.post.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function getPosts(): Promise<PostMin[]> {
  return prisma.post.findMany({
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          description: true,
          score: true,
        }
      },
      comments: {
        select: {
          id: true,
          body: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            }
          }
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function deletePost(id: Post['id'], userId: User['id']) {
  const count = await prisma.post.count({ where: { id, userId } });
  if (count === 0) {
    throw new Error('Post not found');
  }

  return prisma.post.delete({ where: { id } });
}

export async function addComment(id: Post['id'], userId: User['id'], body: string) {
  const count = await prisma.post.count({ where: { id } });
  if (count === 0) {
    throw new Error('Post not found');
  }

  return prisma.comment.create({
    data: {
      body,
      post: {
        connect: { id },
      },
      user: {
        connect: { id: userId },
      },
    },
  });
}

export async function deleteComment(id: Comment['id'], userId: User['id']) {
  const count = await prisma.comment.count({ where: { id, userId } });
  if (count === 0) {
    throw new Error('Comment not found');
  }

  return prisma.comment.delete({ where: { id } });
}
