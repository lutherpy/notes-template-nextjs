export type Note = {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NoteWithUser = Note & {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  } | null;
};