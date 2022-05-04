import type { LoaderFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import Layout from '~/components/Layout';
import { requireUserId } from '~/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function HomePage() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}