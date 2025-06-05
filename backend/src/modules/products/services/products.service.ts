import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull, Like, FindOptionsWhere, FindOptionsOrder, FindOptionsRelations, DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { CategoriesService } from './categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImagesRepository: Repository<ProductImage>,
    @InjectRepository(ProductVariant)
    private productVariantsRepository: Repository<ProductVariant>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar si ya existe un producto con el mismo SKU o slug
      const existingProduct = await this.productsRepository.findOne({
        where: [{ sku: createProductDto.sku }, { slug: createProductDto.slug }],
      });

      if (existingProduct) {
        if (existingProduct.sku === createProductDto.sku) {
          throw new ConflictException(`Ya existe un producto con el SKU: ${createProductDto.sku}`);
        } else {
          throw new ConflictException(`Ya existe un producto con el slug: ${createProductDto.slug}`);
        }
      }

      // Crear el producto
      const product = this.productsRepository.create({
        ...createProductDto,
        user: { id: userId },
      });

      // Guardar el producto
      const savedProduct = await queryRunner.manager.save(product);

      // Asignar categorías si se proporcionaron
      if (createProductDto.categoryIds && createProductDto.categoryIds.length > 0) {
        const categories = await this.categoriesService.findByIds(createProductDto.categoryIds);
        savedProduct.categories = categories;
        await queryRunner.manager.save(savedProduct);
      }

      // Guardar imágenes si se proporcionaron
      if (createProductDto.images && createProductDto.images.length > 0) {
        const images = createProductDto.images.map(imageDto =>
          this.productImagesRepository.create({
            ...imageDto,
            product: savedProduct,
          })
        );
        savedProduct.images = await queryRunner.manager.save(images);
      }

      // Guardar variantes si se proporcionaron
      if (createProductDto.variants && createProductDto.variants.length > 0) {
        const variants = createProductDto.variants.map(variantDto =>
          this.productVariantsRepository.create({
            ...variantDto,
            product: savedProduct,
          })
        );
        savedProduct.variants = await queryRunner.manager.save(variants);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedProduct.id); // Recargar el producto con relaciones
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el producto');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    paginationDto: PaginationDto & {
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
  ): Promise<PaginatedResponseDto<Product>> {
    const { page = 1, limit = 10, search, category, minPrice, maxPrice, sortBy, sortOrder = 'DESC' } = paginationDto;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Product> = { isPublished: true };
    const order: FindOptionsOrder<Product> = {};
    const relations: FindOptionsRelations<Product> = { images: true, categories: true };

    // Aplicar búsqueda
    if (search) {
      where.name = Like(`%${search}%`);
    }

    // Filtrar por categoría
    if (category) {
      where.categories = { id: category };
    }

    // Filtrar por rango de precios
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price = { ...where.price, $gte: minPrice } as any;
      if (maxPrice !== undefined) where.price = { ...where.price, $lte: maxPrice } as any;
    }

    // Ordenar
    if (sortBy) {
      order[sortBy] = sortOrder;
    } else {
      order.createdAt = 'DESC';
    }

    const [items, total] = await this.productsRepository.findAndCount({
      where,
      relations,
      order,
      skip,
      take: limit,
    });

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

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['images', 'categories', 'variants', 'reviews', 'user'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: ['images', 'categories', 'variants', 'reviews', 'user'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con slug "${slug}" no encontrado`);
    }

    return product;
  }

  async findFeatured(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { isFeatured: true, isPublished: true },
      relations: ['images'],
      take: 10,
      order: { createdAt: 'DESC' },
    });
  }

  async findOnSale(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { isOnSale: true, isPublished: true },
      relations: ['images'],
      take: 10,
      order: { updatedAt: 'DESC' },
    });
  }

  async findNewArrivals(days: number = 30): Promise<Product[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.productsRepository.find({
      where: {
        isPublished: true,
        createdAt: { $gte: date } as any,
      },
      relations: ['images'],
      take: 10,
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: string): Promise<Product[]> {
    return this.productsRepository.find({
      where: [
        { name: Like(`%${query}%`), isPublished: true },
        { description: Like(`%${query}%`), isPublished: true },
        { shortDescription: Like(`%${query}%`), isPublished: true },
      ],
      relations: ['images'],
      take: 10,
    });
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId: string,
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['categories', 'images', 'variants'],
      });

      if (!product) {
        throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
      }

      // Verificar permisos (solo el propietario o un administrador puede actualizar)
      if (product.userId !== userId) {
        const user = await queryRunner.manager.findOne('User', { where: { id: userId } });
        if (user?.role !== 'admin') {
          throw new BadRequestException('No tienes permiso para actualizar este producto');
        }
      }

      // Actualizar campos básicos
      Object.assign(product, updateProductDto);

      // Actualizar categorías si se proporcionaron
      if (updateProductDto.categoryIdsToAdd || updateProductDto.categoryIdsToRemove) {
        const currentCategoryIds = product.categories.map(cat => cat.id);
        const categoriesToAdd = updateProductDto.categoryIdsToAdd || [];
        const categoriesToRemove = updateProductDto.categoryIdsToRemove || [];
        
        const newCategoryIds = [
          ...currentCategoryIds.filter(id => !categoriesToRemove.includes(id)),
          ...categoriesToAdd.filter(id => !currentCategoryIds.includes(id)),
        ];
        
        if (newCategoryIds.length > 0) {
          product.categories = await this.categoriesService.findByIds(newCategoryIds);
        } else {
          product.categories = [];
        }
      }

      // Actualizar imágenes
      if (updateProductDto.imagesToAdd && updateProductDto.imagesToAdd.length > 0) {
        const newImages = updateProductDto.imagesToAdd.map(imageDto =>
          this.productImagesRepository.create({
            ...imageDto,
            product: { id },
          })
        );
        await queryRunner.manager.save(newImages);
      }

      if (updateProductDto.imageIdsToRemove && updateProductDto.imageIdsToRemove.length > 0) {
        await this.productImagesRepository.delete({
          id: In(updateProductDto.imageIdsToRemove),
          product: { id },
        });
      }

      // Actualizar variantes
      if (updateProductDto.variantsToAdd && updateProductDto.variantsToAdd.length > 0) {
        const newVariants = updateProductDto.variantsToAdd.map(variantDto =>
          this.productVariantsRepository.create({
            ...variantDto,
            product: { id },
          })
        );
        await queryRunner.manager.save(newVariants);
      }

      if (updateProductDto.variantsToUpdate && updateProductDto.variantsToUpdate.length > 0) {
        for (const variantDto of updateProductDto.variantsToUpdate) {
          await this.productVariantsRepository.update(
            { id: variantDto.id, product: { id } },
            variantDto
          );
        }
      }

      if (updateProductDto.variantIdsToRemove && updateProductDto.variantIdsToRemove.length > 0) {
        await this.productVariantsRepository.delete({
          id: In(updateProductDto.variantIdsToRemove),
          product: { id },
        });
      }

      // Guardar cambios
      const updatedProduct = await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      
      return this.findOne(updatedProduct.id); // Recargar el producto con relaciones
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el producto');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!product) {
        throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
      }

      // Verificar permisos (solo el propietario o un administrador puede eliminar)
      if (product.userId !== userId) {
        const user = await queryRunner.manager.findOne('User', { where: { id: userId } });
        if (user?.role !== 'admin') {
          throw new BadRequestException('No tienes permiso para eliminar este producto');
        }
      }

      // Eliminar imágenes asociadas
      await this.productImagesRepository.delete({ product: { id } });
      
      // Eliminar variantes asociadas
      await this.productVariantsRepository.delete({ product: { id } });
      
      // Eliminar el producto
      await this.productsRepository.remove(product);
      
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar el producto');
    } finally {
      await queryRunner.release();
    }
  }

  async addImages(id: string, imageUrls: string[], userId: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
    }

    // Verificar permisos (solo el propietario o un administrador puede agregar imágenes)
    if (product.userId !== userId) {
      const user = await this.dataSource.manager.findOne('User', { where: { id: userId } });
      if (user?.role !== 'admin') {
        throw new BadRequestException('No tienes permiso para modificar este producto');
      }
    }

    const images = imageUrls.map(url =>
      this.productImagesRepository.create({
        url,
        product: { id },
      })
    );

    await this.productImagesRepository.save(images);
    return this.findOne(id);
  }

  async removeImage(id: string, imageId: string, userId: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['user', 'images'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
    }

    // Verificar permisos (solo el propietario o un administrador puede eliminar imágenes)
    if (product.userId !== userId) {
      const user = await this.dataSource.manager.findOne('User', { where: { id: userId } });
      if (user?.role !== 'admin') {
        throw new BadRequestException('No tienes permiso para modificar este producto');
      }
    }

    // Verificar que la imagen pertenece al producto
    const imageExists = product.images.some(img => img.id === imageId);
    if (!imageExists) {
      throw new NotFoundException(`Imagen con ID "${imageId}" no encontrada en este producto`);
    }

    await this.productImagesRepository.delete({ id: imageId, product: { id } });
    return this.findOne(id);
  }

  // Métodos auxiliares
  async increaseViewCount(id: string): Promise<void> {
    await this.productsRepository.increment({ id }, 'viewCount', 1);
  }

  async updateStock(id: string, quantity: number): Promise<boolean> {
    const result = await this.productsRepository
      .createQueryBuilder()
      .update(Product)
      .set({ stock: () => `stock + ${quantity}` })
      .where('id = :id AND stock + :quantity >= 0', { id, quantity })
      .execute();

    return result.affected > 0;
  }

  async updateAverageRating(id: string): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['reviews'],
    });

    if (!product) return;

    if (product.reviews && product.reviews.length > 0) {
      const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
      product.averageRating = Number((sum / product.reviews.length).toFixed(1));
      product.reviewCount = product.reviews.length;
    } else {
      product.averageRating = 0;
      product.reviewCount = 0;
    }

    await this.productsRepository.save(product);
  }
}
