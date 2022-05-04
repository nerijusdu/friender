import type { User, Post } from '@prisma/client';

import { prisma } from '~/db.server';
import type { UserMin } from './user.server';

export type { Post } from '@prisma/client';

export type PostMin = Pick<Post, 'id' | 'title' | 'body' | 'createdAt' | 'updatedAt'> & {
  user: UserMin;
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

export function getPosts() {
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
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
  });
}