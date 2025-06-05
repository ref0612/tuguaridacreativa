import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseUUIDPipe, 
  UseGuards,
  Req,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { Request } from 'express';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente', type: Category })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para realizar esta acción' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías', type: [Category] })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  async findAll(
    @Query('includeInactive') includeInactive: boolean = false
  ): Promise<Category[]> {
    return this.categoriesService.findAll(includeInactive);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Obtener el árbol de categorías' })
  @ApiResponse({ status: 200, description: 'Árbol de categorías', type: [Category] })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  async findTree(
    @Query('includeInactive') includeInactive: boolean = false
  ): Promise<Category[]> {
    return this.categoriesService.findTree(includeInactive);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Obtener categorías destacadas' })
  @ApiResponse({ status: 200, description: 'Lista de categorías destacadas', type: [Category] })
  async findFeatured(): Promise<Category[]> {
    return this.categoriesService.findFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada', type: Category })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Category> {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
    }
    return category;
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener una categoría por slug' })
  @ApiResponse({ status: 200, description: 'Categoría encontrada', type: Category })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async findBySlug(@Param('slug') slug: string): Promise<Category> {
    const category = await this.categoriesService.findBySlug(slug);
    if (!category) {
      throw new NotFoundException(`Categoría con slug "${slug}" no encontrada`);
    }
    return category;
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Obtener productos de una categoría' })
  @ApiResponse({ status: 200, description: 'Lista de productos de la categoría', type: PaginatedResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async findProductsByCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ): Promise<PaginatedResponseDto<any>> {
    return this.categoriesService.findProductsByCategory(id, {
      ...paginationDto,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una categoría' })
  @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente', type: Category })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para realizar esta acción' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    const category = await this.categoriesService.update(id, updateCategoryDto);
    if (!category) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
    }
    return category;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiResponse({ status: 200, description: 'Categoría eliminada exitosamente' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar una categoría con subcategorías o productos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para realizar esta acción' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const result = await this.categoriesService.remove(id);
    if (!result) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
    }
  }

  @Post(':id/upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir imagen para una categoría' })
  @ApiResponse({ status: 200, description: 'Imagen subida exitosamente', type: Category })
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('imageUrl') imageUrl: string
  ): Promise<Category> {
    if (!imageUrl) {
      throw new BadRequestException('La URL de la imagen es requerida');
    }
    return this.categoriesService.uploadImage(id, imageUrl);
  }

  @Post(':id/move')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mover una categoría dentro del árbol' })
  @ApiResponse({ status: 200, description: 'Categoría movida exitosamente', type: Category })
  async move(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('parentId') parentId?: string
  ): Promise<Category> {
    return this.categoriesService.move(id, parentId);
  }
}
