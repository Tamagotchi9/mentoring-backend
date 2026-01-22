import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from '../notes/schemas/note.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Note.name) private noteModel: Model<Note>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    if (!createCategoryDto.name) {
      throw new BadRequestException('Name is required');
    }
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  findAll(userId: string): Promise<Category[]> {
    const query = { user: userId };
    return this.categoryModel
      .find(query)
      .populate('user', '_id email username createdAt')
      .exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findById(id)
      .populate('user', '_id email username createdAt')
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .populate('user', '_id email username createdAt')
      .exec();
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return updatedCategory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    await this.noteModel.deleteMany({ category: id }).exec();
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
