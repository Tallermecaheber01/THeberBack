import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Obtener todas las categorías
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  // Obtener una categoría por su ID
  async findById(idcategoria: number): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { idcategoria },
    });
  }
}
