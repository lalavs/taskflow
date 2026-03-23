import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();

    const { id } = await params;

    const updated = await prisma.note.upsert({
      where: { id },
      update: {
        x: body.x,
        y: body.y,
        content: body.content,
        height: body.height,
      },
      create: {
        id: id,
        x: body.x,
        y: body.y,
        content: body.content,
        height: body.height,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
