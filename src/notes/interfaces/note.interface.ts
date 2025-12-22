export interface Note {
  id: string;
  title: string;
  text: string;
  asTask: boolean;
  completed: boolean;
  remindDate: string | null;
  createdAt: string;
  updatedAt: string;
}
