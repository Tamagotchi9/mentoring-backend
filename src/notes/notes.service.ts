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
    if (createNoteDto.category) {
      const categoryExists = await this.categoryModel.findById(
        createNoteDto.category,
      );
      if (!categoryExists) {
        throw new BadRequestException('Category not found');
      }
    }
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  findAll(userId: string, categoryId?: string): Promise<Note[]> {
    const query = categoryId
      ? { user: userId, category: categoryId }
      : { user: userId };
    return this.noteModel
      .find(query)
      .populate('category')
      .populate('user', '_id email username createdAt')
      .exec();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteModel
      .findById(id)
      .populate('category')
      .populate('user', '_id email username createdAt')
      .exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const updatedNote = await this.noteModel
      .findByIdAndUpdate(id, updateNoteDto, { new: true })
      .populate('category')
      .populate('user', '_id email username createdAt')
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
