import type { ActionFunction} from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { rankUser } from '~/models/user.server';
import { requireUserId } from '~/session.server';

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const user2Id = formData.get('userId');
  invariant(user2Id, 'userId is required');

  await rankUser(userId, user2Id as string);

  return redirect(`/users/${user2Id}`);
};