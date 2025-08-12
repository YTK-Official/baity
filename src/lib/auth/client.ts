import { createAuthClient } from 'better-auth/client';
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';

// Only use NEXT_PUBLIC_ variables in client components
import { env } from '@/config/env';

import type { auth } from '.';

export const authClient = createAuthClient({
  // Only use NEXT_PUBLIC_ variables here
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});
