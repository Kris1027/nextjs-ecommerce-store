import { client } from '@/api/generated/client.gen';
import { env } from '@/config/env';

client.setConfig({
  baseUrl: env.NEXT_PUBLIC_API_URL,
});

export { client };
