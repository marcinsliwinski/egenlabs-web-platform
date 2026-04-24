import type { ReactNode } from 'react';

import { requireAuthenticatedAdmin } from '@/features/auth/auth-service';

type ProtectedAdminLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedAdminLayout({ children }: ProtectedAdminLayoutProps) {
  await requireAuthenticatedAdmin();

  return children;
}
