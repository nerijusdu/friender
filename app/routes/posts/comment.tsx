import type { ActionFunction} from '@remix-run/server-runtime';
import { redirect} from '@remix-run/server-runtime';
import { addComment, deleteComment } from '~/models/posts.server';
import { requireUserId } from '~/session.server';

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const method = formData.get('_method');

  if (method === 'delete') {
    const commentId = formData.get('commentId') as string;
    await deleteComment(commentId, userId);
  }
  else {
    const postId = formData.get('postId') as string;
    const comment = formData.get('comment') as string;

    await addComment(postId, userId, comment);
  }

  return redirect('/posts');
};