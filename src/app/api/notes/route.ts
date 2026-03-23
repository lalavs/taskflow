import { NextResponse } from 'next/server';

import { getAllNotes } from '@/entities/note/model/note.repo';

export async function GET() {
  try {
    const notes = await getAllNotes();

    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}
