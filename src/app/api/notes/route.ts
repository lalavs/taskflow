import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';

import { getAllNotes } from '@/entities/note/model/note.repo';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notes = await getAllNotes(session.user.id);

    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}
