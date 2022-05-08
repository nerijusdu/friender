import { Button } from '@chakra-ui/react';
import type { ActionFunction} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useTransition } from '@remix-run/react';
import Card from '~/components/Card';
import FormInput from '~/components/FormInput';
import Layout from '~/components/Layout';
import { createPost } from '~/models/posts.server';
import { requireUserId } from '~/session.server';

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get('title');
  const body = formData.get('body');

  if (typeof title !== 'string' || title.length === 0) {
    return json<ActionData>(
      { errors: { title: 'Title is required' } },
      { status: 400 }
    );
  }

  if (typeof body !== 'string' || body.length === 0) {
    return json<ActionData>(
      { errors: { body: 'Text is required' } },
      { status: 400 }
    );
  }

  await createPost({ title, body, userId });

  return redirect('/posts');
};

const NewPost : React.FC = () => {
  const actionData = useActionData() as ActionData;
  const transition = useTransition();

  return (
    <Layout>
      <Card as={Form} method="POST" direction="column" gap={4}>
        <FormInput
          label="Title"
          name="title"
          error={actionData?.errors?.title}
        />
        <FormInput
          label="Text"
          name="body"
          error={actionData?.errors?.body}
          isTextArea
        />
        <Button
          colorScheme="purple"
          type="submit"
          isLoading={transition.state === 'submitting'}
        >
          Submit
        </Button>
      </Card>
    </Layout>
  );
};

export default NewPost;
