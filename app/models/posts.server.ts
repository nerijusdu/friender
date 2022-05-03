import type { User, Post } from '@prisma/client';

import { prisma } from '~/db.server';

export type { Post } from '@prisma/client';

export type PostMin = Pick<Post, 'id' | 'title' | 'body' | 'createdAt' | 'updatedAt'>;

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

export function getPosts({ userId }: { userId: User['id'] }) {
  return prisma.post.findMany({
    where: { userId },
    select: { id: true, title: true, body: true, createdAt: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  });
}