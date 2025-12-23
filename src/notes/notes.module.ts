import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schemas/note.schema';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    CategoriesModule,
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
