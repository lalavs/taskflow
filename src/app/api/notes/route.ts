import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const notes = await prisma.note.findMany();

    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}
