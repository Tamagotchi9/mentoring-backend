import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from 'src/categories/schemas/category.schema';
import { User } from 'src/users/schemas/user.schema';

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note {
  @Prop()
  title: string;

  @Prop()
  text: string;

  @Prop({ default: false })
  asTask: boolean;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: String, default: null })
  remindDate: string | null;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
