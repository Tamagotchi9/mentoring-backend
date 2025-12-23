import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop()
  name: string;

  @Prop({ type: String, default: null })
  description: string | null;

  @Prop({ type: String, default: null })
  color: string | null;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
