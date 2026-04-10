import { runAI } from '@/lib/ai/ai.service';

export async function POST(req: Request) {
  const { text, action } = await req.json();

  if (!text) {
    return Response.json({ error: 'No text' }, { status: 400 });
  }

  const result = await runAI(text, action);

  return Response.json({ result });
}
