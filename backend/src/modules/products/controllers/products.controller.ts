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
  BadRequestException,
  NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { Request } from 'express';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: Product })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para realizar esta acción' })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request
  ): Promise<Product> {
    const userId = req.user['id'];
    return this.productsService.create(createProductDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos', type: PaginatedResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ): Promise<PaginatedResponseDto<Product>> {
    return this.productsService.findAll({
      ...paginationDto,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Obtener productos destacados' })
  @ApiResponse({ status: 200, description: 'Lista de productos destacados', type: [Product] })
  async findFeatured(): Promise<Product[]> {
    return this.productsService.findFeatured();
  }

  @Get('on-sale')
  @ApiOperation({ summary: 'Obtener productos en oferta' })
  @ApiResponse({ status: 200, description: 'Lista de productos en oferta', type: [Product] })
  async findOnSale(): Promise<Product[]> {
    return this.productsService.findOnSale();
  }

  @Get('new-arrivals')
  @ApiOperation({ summary: 'Obtener nuevos productos' })
  @ApiResponse({ status: 200, description: 'Lista de nuevos productos', type: [Product] })
  async findNewArrivals(): Promise<Product[]> {
    return this.productsService.findNewArrivals();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar productos' })
  @ApiResponse({ status: 200, description: 'Resultados de la búsqueda', type: [Product] })
  @ApiQuery({ name: 'query', required: true, type: String })
  async search(@Query('query') query: string): Promise<Product[]> {
    if (!query) {
      throw new BadRequestException('El parámetro de búsqueda es requerido');
    }
    return this.productsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Product> {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
    }
    return product;
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener un producto por slug' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: Product })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findBySlug(@Param('slug') slug: string): Promise<Product> {
    const product = await this.productsService.findBySlug(slug);
    if (!product) {
      throw new NotFoundException(`Producto con slug "${slug}" no encontrado`);
    }
    return product;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente', type: Product })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para realizar esta acción' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request
  ): Promise<Product> {
    const userId = req.user['id'];
    const product = await this.productsService.update(id, updateProductDto, userId);
    if (!product) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
    }
    return product;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'No tiene permisos para realizar esta acción' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request
  ): Promise<void> {
    const userId = req.user['id'];
    const result = await this.productsService.remove(id, userId);
    if (!result) {
      throw new NotFoundException(`Producto con ID "${id}" no encontrado`);
    }
  }

  // Endpoints adicionales para gestión de imágenes y variantes
  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Añadir imágenes a un producto' })
  @ApiResponse({ status: 200, description: 'Imágenes añadidas exitosamente', type: Product })
  async addImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() imageUrls: string[],
    @Req() req: Request
  ): Promise<Product> {
    const userId = req.user['id'];
    return this.productsService.addImages(id, imageUrls, userId);
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una imagen de un producto' })
  @ApiResponse({ status: 200, description: 'Imagen eliminada exitosamente', type: Product })
  async removeImage(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @Req() req: Request
  ): Promise<Product> {
    const userId = req.user['id'];
    return this.productsService.removeImage(id, imageId, userId);
  }
}
