export interface INoteContent {
  x: number;
  y: number;
  content: string;
  height: number;
}

export interface INote extends INoteContent {
  id: string;
}
