export class CreateNoteDto {
  title: string;
  text: string;
  asTask?: boolean;
  completed?: boolean;
  remindDate?: string | null;
  category?: string;
  user: string;
}
