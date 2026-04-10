export interface NoteContent {
  x: number;
  y: number;
  content: string;
  height: number;
}

export interface Note extends NoteContent {
  id: string;
}
