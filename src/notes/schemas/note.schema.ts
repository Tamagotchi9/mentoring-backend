import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

  @Prop({ default: null })
  remindDate: string | null;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
