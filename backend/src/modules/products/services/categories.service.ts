import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, TreeRepository, FindOptionsWhere, Like } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@Injectable()
export class CategoriesService {
  private treeRepository: TreeRepository<Category>;

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {
    this.treeRepository = categoriesRepository.manager.getTreeRepository(Category);
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar si ya existe una categoría con el mismo nombre o slug
    const existingCategory = await this.categoriesRepository.findOne({
      where: [
        { name: createCategoryDto.name },
        { slug: createCategoryDto.slug },
      ],
    });

    if (existingCategory) {
      if (existingCategory.name === createCategoryDto.name) {
        throw new ConflictException(`Ya existe una categoría con el nombre: ${createCategoryDto.name}`);
      } else {
        throw new ConflictException(`Ya existe una categoría con el slug: ${createCategoryDto.slug}`);
      }
    }

    // Crear la categoría
    const category = this.categoriesRepository.create(createCategoryDto);

    // Establecer la categoría padre si se proporcionó
    if (createCategoryDto.parentId) {
      const parentCategory = await this.categoriesRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });

      if (!parentCategory) {
        throw new NotFoundException(`Categoría padre con ID "${createCategoryDto.parentId}" no encontrada`);
      }

      category.parent = parentCategory;
    }

    return this.categoriesRepository.save(category);
  }

  async findAll(includeInactive: boolean = false): Promise<Category[]> {
    const where: FindOptionsWhere<Category> = {};
    if (!includeInactive) {
      where.isActive = true;
    }

    return this.categoriesRepository.find({
      where,
      order: { order: 'ASC', name: 'ASC' },
    });
  }

  async findTree(includeInactive: boolean = false): Promise<Category[]> {
    const where: FindOptionsWhere<Category> = { parent: null };
    if (!includeInactive) {
      where.isActive = true;
    }

    const roots = await this.categoriesRepository.find({
      where,
      order: { order: 'ASC', name: 'ASC' },
    });

    return Promise.all(
      roots.map(root => this.treeRepository.findDescendantsTree(root, {
        depth: 10,
        relations: ['children'],
      }))
    );
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
    }

    return category;
  }

  async findByIds(ids: string[]): Promise<Category[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.categoriesRepository.find({
      where: { id: In(ids) },
    });
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Categoría con slug "${slug}" no encontrada`);
    }

    return category;
  }

  async findFeatured(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { isFeatured: true, isActive: true },
      order: { order: 'ASC', name: 'ASC' },
      take: 10,
    });
  }

  async findProductsByCategory(
    categoryId: string,
    paginationDto: PaginationDto & {
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<PaginatedResponseDto<any>> {
    const { page = 1, limit = 10, minPrice, maxPrice, sortBy, sortOrder = 'DESC' } = paginationDto;
    const skip = (page - 1) * limit;

    // Obtener la categoría y todas sus subcategorías
    const category = await this.findOne(categoryId);
    const categoryTree = await this.treeRepository.findDescendantsTree(category, {
      relations: ['children'],
    });

    // Obtener todos los IDs de categorías (incluyendo subcategorías)
    const categoryIds = this.collectCategoryIds(categoryTree);

    // Construir la consulta
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.images', 'image')
      .where('category.id IN (:...categoryIds)', { categoryIds })
      .andWhere('product.isPublished = :isPublished', { isPublished: true });

    // Aplicar filtros de precio
    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Ordenar
    if (sortBy) {
      const order: any = {};
      order[`product.${sortBy}`] = sortOrder;
      query.orderBy(order);
    } else {
      query.orderBy('product.createdAt', 'DESC');
    }

    // Paginación
    const [items, total] = await query
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
    }

    // Verificar si se está intentando establecer un padre que no existe
    if (updateCategoryDto.parentId !== undefined) {
      if (updateCategoryDto.parentId === null) {
        // Establecer como categoría raíz
        category.parent = null;
      } else if (updateCategoryDto.parentId !== category.parent?.id) {
        // Verificar que la nueva categoría padre existe
        const parentCategory = await this.categoriesRepository.findOne({
          where: { id: updateCategoryDto.parentId },
        });

        if (!parentCategory) {
          throw new NotFoundException(`Categoría padre con ID "${updateCategoryDto.parentId}" no encontrada`);
        }

        // Verificar que no se está creando un bucle (la categoría padre no puede ser un descendiente)
        if (await this.isDescendant(id, updateCategoryDto.parentId)) {
          throw new BadRequestException('No se puede establecer una categoría hija como padre');
        }

        category.parent = parentCategory;
      }
    }

    // Actualizar otros campos
    Object.assign(category, updateCategoryDto);

    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<boolean> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['children', 'products'],
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
    }

    // Verificar que no tenga subcategorías
    if (category.children && category.children.length > 0) {
      throw new BadRequestException('No se puede eliminar una categoría que tiene subcategorías');
    }

    // Verificar que no tenga productos asociados
    const productCount = await this.productsRepository.count({
      where: { categories: { id } },
    });

    if (productCount > 0) {
      throw new BadRequestException('No se puede eliminar una categoría que tiene productos asociados');
    }

    await this.categoriesRepository.remove(category);
    return true;
  }

  async uploadImage(id: string, imageUrl: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
    }

    category.image = imageUrl;
    return this.categoriesRepository.save(category);
  }

  async move(id: string, parentId?: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!category) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
    }

    // Si no se proporciona parentId, se mueve a la raíz
    if (!parentId) {
      category.parent = null;
      return this.categoriesRepository.save(category);
    }

    // Verificar que la categoría padre existe
    const parentCategory = await this.categoriesRepository.findOne({
      where: { id: parentId },
    });

    if (!parentCategory) {
      throw new NotFoundException(`Categoría padre con ID "${parentId}" no encontrada`);
    }

    // Verificar que no se está creando un bucle
    if (await this.isDescendant(id, parentId)) {
      throw new BadRequestException('No se puede mover una categoría dentro de una de sus propias subcategorías');
    }

    category.parent = parentCategory;
    return this.categoriesRepository.save(category);
  }

  // Métodos auxiliares
  private collectCategoryIds(category: Category): string[] {
    let ids = [category.id];
    
    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        ids = [...ids, ...this.collectCategoryIds(child)];
      }
    }
    
    return ids;
  }

  private async isDescendant(parentId: string, childId: string): Promise<boolean> {
    if (parentId === childId) return true;
    
    const parentCategory = await this.categoriesRepository.findOne({
      where: { id: childId },
      relations: ['parent'],
    });

    if (!parentCategory || !parentCategory.parent) return false;
    
    if (parentCategory.parent.id === parentId) return true;
    
    return this.isDescendant(parentId, parentCategory.parent.id);
  }
}
