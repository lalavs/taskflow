export interface INoteContent {
  x: number;
  y: number;
  content: string;
}

export interface INote extends INoteContent {
  id: string;
}
