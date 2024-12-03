import { isValidChain } from 'universal-data';
import { env } from '@/env';

export async function POST(
  request: Request,
  { params: { chainId: chainIdStr } }: { params: { chainId: string } },
) {
  const chainId = Number(chainIdStr);
  if (!isValidChain(chainId)) {
    return new Response('Chain not supported', { status: 404 });
  }

  const body = await request.json();

  const response = await fetch(
    `https://api.pimlico.io/v2/${chainId}/rpc?apikey=${env.NEXT_PUBLIC_PIMLICO_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    return new Response(response.statusText, { status: response.status });
  }

  return new Response(JSON.stringify(await response.json()), { status: 200 });
}
