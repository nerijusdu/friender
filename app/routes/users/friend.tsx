import type { ActionFunction} from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { getUserById, addFriend, removeFriend } from '~/models/user.server';
import { requireUserId } from '~/session.server';

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const friendId = formData.get('userId');
  const method = formData.get('_method');
  invariant(friendId, 'userId is required');

  const friend = await getUserById(friendId as string);
  invariant(friend, 'friend is required');

  method === 'post'
    ? await addFriend(userId, friend.id)
    : await removeFriend(userId, friend.id);

  return redirect(`/users/${friend.id}`);
};