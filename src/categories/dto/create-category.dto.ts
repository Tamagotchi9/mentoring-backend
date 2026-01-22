export class CreateCategoryDto {
  name: string;
  description?: string | null;
  color?: string | null;
  user: string;
}
