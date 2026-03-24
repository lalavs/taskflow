import { NextResponse } from 'next/server';

import { getBoardView, updateBoardView } from '@/entities/board/model/board.repo';

export async function GET() {
  try {
    const view = await getBoardView();

    return NextResponse.json(view);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch board view' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { x, y, zoom } = body;

    const updated = await updateBoardView({ x, y, zoom });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update board view' }, { status: 500 });
  }
}
