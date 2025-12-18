import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note {
  @Prop()
  title: string;

  @Prop()
  text: string;

  @Prop()
  asTask: boolean;

  @Prop()
  completed: boolean;

  @Prop()
  remindDate: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
