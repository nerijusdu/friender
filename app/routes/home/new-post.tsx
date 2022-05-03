import { Button, FormControl, FormErrorMessage, FormLabel, Input, Textarea } from '@chakra-ui/react';
import type { ActionFunction} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import Card from '~/components/Card';
import { createPost } from '~/models/posts.server';
import { requireUserId } from '~/session.server';

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
  data?: {
    title?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get('title');
  const body = formData.get('body');
  const data = { title, body } as ActionData['data'];

  if (typeof title !== 'string' || title.length === 0) {
    return json<ActionData>(
      { errors: { title: 'Title is required' }, data },
      { status: 400 }
    );
  }

  if (typeof body !== 'string' || body.length === 0) {
    return json<ActionData>(
      { errors: { body: 'Text is required' }, data },
      { status: 400 }
    );
  }

  await createPost({ title, body, userId });

  return redirect('/home/posts');
};

const NewPost : React.FC = () => {
  const actionData = useActionData() as ActionData;
  console.log(actionData);
  return (
    <Card as="form" method="POST" direction="column" gap={4}>
      <FormControl isInvalid={!!actionData?.errors?.title}>
        <FormLabel htmlFor='title'>Title</FormLabel>
        <Input id='title' name="title" type='text' defaultValue={actionData?.data?.title} />
        {actionData?.errors?.title && (
          <FormErrorMessage>{actionData.errors.title}</FormErrorMessage>
        )}
      </FormControl>
      <FormControl isInvalid={!!actionData?.errors?.body}>
        <FormLabel htmlFor='body'>Text</FormLabel>
        <Textarea id='body' name="body" defaultValue={actionData?.data?.body} />
        {actionData?.errors?.body && (
          <FormErrorMessage>{actionData.errors.body}</FormErrorMessage>
        )}
      </FormControl>
      <Button colorScheme="purple" type="submit">Submit</Button>
    </Card>
  );
};

export default NewPost;
