import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './schemas/note.schema';
import { Model } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    if (!createNoteDto.title) {
      throw new BadRequestException('Title is required');
    }
    if (createNoteDto.categoryId) {
      const categoryExists = await this.categoryModel.findById(
        createNoteDto.categoryId,
      );
      if (!categoryExists) {
        throw new BadRequestException('Category not found');
      }
    }
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  findAll(categoryId?: string): Promise<Note[]> {
    const query = categoryId ? { categoryId } : {};
    return this.noteModel.find(query).populate('categoryId').exec();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel
      .findById(id)
      .populate('categoryId')
      .exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const updatedNote = await this.noteModel
      .findByIdAndUpdate(id, updateNoteDto, { new: true })
      .exec();
    if (!updatedNote) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return updatedNote;
  }

  async remove(id: string): Promise<void> {
    const result = await this.noteModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }
}
