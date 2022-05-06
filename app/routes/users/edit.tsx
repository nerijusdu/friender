import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Badge, Button, FormControl, FormLabel, Heading, IconButton, Input, InputGroup, InputRightElement, Stack, VStack } from '@chakra-ui/react';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { ActionFunction, LoaderFunction} from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import { useState } from 'react';
import Card from '~/components/Card';
import FormInput from '~/components/FormInput';
import Layout from '~/components/Layout';
import type { UserMin } from '~/models/user.server';
import { updateUser } from '~/models/user.server';
import { getUserProfile } from '~/models/user.server';
import { requireUserId } from '~/session.server';

type LoaderData = {
  user: UserMin;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUserProfile(userId);
  return json<LoaderData>({ user: user! });
};

type ActionData = {
  errors?: {
    name?: string;
    description?: string;
  }
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const tags = formData.getAll('tags[]') as string[];

  if (!name) {
    return json<ActionData>({ errors: { name: 'Name is required' } });
  }
  if (!description) {
    return json<ActionData>({ errors: { description: 'Description is required' } });
  }

  await updateUser({ id: userId, name, description, tags });

  return redirect(`/users/${userId}`);
};

const EditUser : React.FC = () => {
  const { user } = useLoaderData() as LoaderData;
  const data = useActionData() as ActionData;
  const [tags, setTags] = useState(user.tags || []);
  const [tagInput, setTagInput] = useState('');

  return (
    <Layout>
      <Card direction="column">
        <Heading size="lg" fontWeight="semibold">Updates</Heading>
        <Stack as={Form} method="post">
          <FormInput
            name="_"
            defaultValue={user.email}
            label="Email"
            isDisabled
          />
          <FormInput
            name="name"
            defaultValue={user.name}
            error={data?.errors?.name}
            label="Name"
          />
          <FormInput
            name="description"
            defaultValue={user.description}
            error={data?.errors?.description}
            label="Description"
            isTextArea
          />

          <FormControl isInvalid={false}>
            <FormLabel>Tags</FormLabel>
            <VStack align="flex-start">
              {tags.map((tag, i) => (
                <Badge key={tag} colorScheme="purple" px={2}>
                  <input type="hidden" name={'tags[]'} value={tag} />
                  {tag}
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Remove tag"
                    size="sm"
                    rounded="full"
                    variant="ghost"
                    ml={2}
                    my={1}
                    onClick={() => {
                      setTags(tags.filter(t => t !== tag));
                    }}
                  />
                </Badge>
              ))}
              <InputGroup>
                <Input
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    icon={<AddIcon />}
                    onClick={() => {
                      setTags([...tags, tagInput]);
                      setTagInput('');
                    }}
                    aria-label="Add"
                    colorScheme="purple"
                    size="sm"
                    variant="ghost"
                    rounded="full"
                    m={2}
                  />
                </InputRightElement>
              </InputGroup>
            </VStack>
          </FormControl>

          <Button type="submit" colorScheme="purple">
            Save
          </Button>
        </Stack>
      </Card>
    </Layout>
  );
};

export default EditUser;
