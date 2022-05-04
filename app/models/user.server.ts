import type { Password, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { prisma } from '~/db.server';

export type { User } from '@prisma/client';

export type UserMin = Pick<User, 'id' | 'email' | 'name' | 'description'>;
export type UserProfileDto = UserMin & { friends: UserMin[] };
const toMinUser = (user: User): UserMin => ({
  id: user.id,
  email: user.email,
  name: user.name,
  description: user.description,
});

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser({ email, password, name, description }: Partial<User> & { password: string }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email: email!,
      name,
      description,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User['email']) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User['email'],
  password: Password['hash']
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function getFriends(id: User['id']) {
  const user = await prisma.user.findFirst({
    where: { id },
    include: {
      friends: true,
      friendsRelation: true,
    },
  });

  return [...user?.friends ?? [], ...user?.friendsRelation ?? []].map(toMinUser);
}

export async function addFriend(
  userId: User['id'],
  friendId: User['id']
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      friends: {
        connect: { id: friendId },
      },
    },
  });
}

export async function removeFriend(
  userId: User['id'],
  friendId: User['id']
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      friends: {
        disconnect: { id: friendId },
      },
      friendsRelation: {
        disconnect: { id: friendId },
      },
    },
  });
}

export async function getUserProfile(id: User['id']) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      friends: true,
      friendsRelation: true,
    },
  });
  if (!user) {
    return null;
  }

  const friends = [...user.friends, ...user.friendsRelation];

  return {
    ...toMinUser(user),
    friends: friends.map(toMinUser),
  };
}