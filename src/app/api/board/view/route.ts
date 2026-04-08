import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';

import { getBoardView, updateBoardView } from '@/entities/board/model/board.repo';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const view = await getBoardView(session.user.id);
    return NextResponse.json(view);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch board view' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    const updated = await updateBoardView(body, session.user.id);

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update board view' }, { status: 500 });
  }
}
