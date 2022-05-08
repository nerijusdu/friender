import type { ActionFunction} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { deletePost } from '~/models/posts.server';
import { requireUserId } from '~/session.server';

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const postId = formData.get('postId');
  const method = formData.get('_method');

  if (typeof postId !== 'string') {
    return json({ errors: { postId: 'Post ID is required' } }, { status: 400 });
  }

  if (method === 'delete') {
    await deletePost(postId, userId);
  }

  return redirect('/posts');
};