import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';

import { INote } from '@/interfaces/notes';

export async function GET() {
  try {
    const notes = await prisma.note.findMany();

    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const notes = body.notes;

    await prisma.note.deleteMany();

    await prisma.note.createMany({
      data: notes.map((note: INote) => ({
        id: note.id,
        x: note.x,
        y: note.y,
        content: note.content,
      })),
    }); // temporary, update later

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save notes' }, { status: 500 });
  }
}
