import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn,
  ManyToOne, 
  JoinColumn, 
  OneToMany, 
  ManyToMany, 
  JoinTable,
  Index,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
  AfterRemove
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { ProductVariant, VariantType } from './product-variant.entity';
import { Review } from './review.entity';
import { slugify } from '../../../common/utils/slugify';

@Entity('products')
export class Product {
  @ApiProperty({ 
    description: 'ID único del producto', 
    example: '123e4567-e89b-12d3-a456-426614174000',
    readOnly: true 
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    description: 'ID del usuario que creó el producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    readOnly: true
  })
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ApiProperty({ description: 'Nombre del producto', example: 'Lienzo para pintura 40x60cm' })
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ApiProperty({ 
    description: 'Slug único para URLs amigables', 
    example: 'lienzo-para-pintura-40x60cm',
    readOnly: true 
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  slug: string;

  @ApiProperty({ description: 'Descripción corta del producto', example: 'Lienzo de tela de algodón para pintura al óleo y acrílico' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  shortDescription: string;

  @ApiProperty({ description: 'Descripción detallada del producto', example: '<p>Lienzo de alta calidad para artistas profesionales y aficionados...</p>' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Precio base del producto', example: 24.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @ApiPropertyOptional({ 
    description: 'Precio de oferta (opcional)', 
    example: 19.99,
    nullable: true 
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salePrice: number | null;

  @ApiProperty({ description: 'SKU único del producto', example: 'LIENZO-40X60-001' })
  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @ApiProperty({ description: 'Cantidad en inventario', example: 100 })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({ description: 'Peso del producto en gramos', example: 500 })
  @Column({ type: 'int', nullable: true })
  weight: number | null;

  @ApiProperty({ description: 'Ancho del producto en centímetros', example: 40 })
  @Column({ type: 'int', nullable: true })
  width: number | null;

  @ApiProperty({ description: 'Alto del producto en centímetros', example: 60 })
  @Column({ type: 'int', nullable: true })
  height: number | null;

  @ApiProperty({ description: 'Profundidad del producto en centímetros', example: 2 })
  @Column({ type: 'int', nullable: true })
  depth: number | null;

  @ApiProperty({ description: 'Indica si el producto está publicado', example: true })
  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @ApiProperty({ description: 'Indica si el producto está destacado', example: false })
  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Indica si el producto está en oferta', example: false })
  @Column({ type: 'boolean', default: false })
  isOnSale: boolean;

  @ApiProperty({ description: 'Puntuación media del producto (0-5)', example: 4.5 })
  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @ApiProperty({ description: 'Número total de reseñas', example: 15 })
  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @ApiProperty({ 
    description: 'Número total de ventas', 
    example: 42,
    readOnly: true 
  })
  @Column({ type: 'int', default: 0 })
  totalSales: number;

  @ApiProperty({ 
    description: 'Número de visualizaciones del producto', 
    example: 150,
    readOnly: true 
  })
  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @ApiProperty({ 
    description: 'Fecha de eliminación suave (soft delete)',
    example: '2023-01-01T00:00:00.000Z',
    nullable: true,
    readOnly: true 
  })
  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;

  // Relaciones
  @ApiProperty({ 
    description: 'Usuario que creó el producto',
    type: () => User,
    readOnly: true 
  })
  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ 
    description: 'Categorías a las que pertenece el producto',
    type: () => [Category],
    isArray: true,
    readOnly: true 
  })
  @ManyToMany(() => Category, (category) => category.products, { 
    cascade: true,
    onDelete: 'CASCADE' 
  })
  @JoinTable({
    name: 'product_categories',
    joinColumn: { name: 'productId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ApiProperty({ 
    description: 'Imágenes del producto',
    type: () => [ProductImage],
    isArray: true,
    readOnly: true 
  })
  @OneToMany(() => ProductImage, (image) => image.product, { 
    cascade: true,
    eager: true 
  })
  images: ProductImage[];

  @ApiProperty({ 
    description: 'Variantes del producto (tallas, colores, etc.)',
    type: () => [ProductVariant],
    isArray: true,
    readOnly: true 
  })
  @OneToMany(() => ProductVariant, (variant) => variant.product, { 
    cascade: true,
    eager: true 
  })
  variants: ProductVariant[];

  @ApiProperty({ 
    description: 'Reseñas del producto',
    type: () => [Review],
    isArray: true,
    readOnly: true 
  })
  @OneToMany(() => Review, (review) => review.product, {
    onDelete: 'CASCADE'
  })
  reviews: Review[];

  // Campos calculados y lógica de negocio
  
  /**
   * Indica si el producto está disponible (publicado y con stock)
   */
  @ApiProperty({ 
    description: 'Indica si el producto está disponible (publicado y con stock)',
    type: Boolean,
    readOnly: true 
  })
  @Expose()
  get isAvailable(): boolean {
    return this.isPublished && this.stock > 0;
  }

  /**
   * Indica si el producto está en oferta
   */
  @ApiProperty({ 
    description: 'Indica si el producto está en oferta',
    type: Boolean,
    readOnly: true 
  })
  @Expose()
  get onSale(): boolean {
    return this.salePrice !== null && this.salePrice < this.price;
  }

  /**
   * Porcentaje de descuento (si aplica)
   */
  @ApiProperty({ 
    description: 'Porcentaje de descuento (si aplica)',
    type: Number,
    nullable: true,
    readOnly: true,
    example: 20
  })
  @Expose()
  get discountPercentage(): number | null {
    if (!this.onSale) return null;
    return Math.round(((this.price - this.salePrice!) / this.price) * 100);
  }

  /**
   * Obtiene la URL de la imagen principal del producto
   */
  @ApiProperty({ 
    description: 'URL de la imagen principal del producto',
    type: String,
    nullable: true,
    readOnly: true,
    example: 'https://example.com/images/product-1.jpg'
  })
  @Expose()
  get mainImage(): string | null {
    if (!this.images || this.images.length === 0) return null;
    const main = this.images.find(img => img.isMain) || this.images[0];
    return main.url;
  }

  /**
   * Obtiene el precio más bajo entre las variantes (si existen)
   */
  @ApiProperty({ 
    description: 'Precio más bajo entre las variantes (si existen)',
    type: Number,
    readOnly: true,
    example: 19.99
  })
  @Expose()
  get minPrice(): number {
    if (!this.variants || this.variants.length === 0) {
      return this.price;
    }
    return Math.min(...this.variants.map(v => v.price));
  }

  /**
   * Obtiene el precio más alto entre las variantes (si existen)
   */
  @ApiProperty({ 
    description: 'Precio más alto entre las variantes (si existen)',
    type: Number,
    readOnly: true,
    example: 29.99
  })
  @Expose()
  get maxPrice(): number {
    if (!this.variants || this.variants.length === 0) {
      return this.price;
    }
    return Math.max(...this.variants.map(v => v.price));
  }

  /**
   * Obtiene los tipos de variantes disponibles (colores, tallas, etc.)
   */
  @ApiProperty({ 
    description: 'Tipos de variantes disponibles (colores, tallas, etc.)',
    type: [String],
    readOnly: true,
    example: ['color', 'size']
  })
  @Expose()
  get variantTypes(): string[] {
    if (!this.variants || this.variants.length === 0) return [];
    return [...new Set(this.variants.map(v => v.type))];
  }

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name && !this.slug) {
      this.slug = slugify(this.name);
    }
  }

  @BeforeInsert()
  setDefaultValues() {
    if (this.stock === undefined) this.stock = 0;
    if (this.totalSales === undefined) this.totalSales = 0;
    if (this.viewCount === undefined) this.viewCount = 0;
    if (this.averageRating === undefined) this.averageRating = 0;
    if (this.reviewCount === undefined) this.reviewCount = 0;
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  @AfterRemove()
  updateComputedFields() {
    // Asegurarse de que los campos calculados estén actualizados
    if (this.reviews && this.reviews.length > 0) {
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.averageRating = Number((sum / this.reviews.length).toFixed(1));
      this.reviewCount = this.reviews.length;
    } else {
      this.averageRating = 0;
      this.reviewCount = 0;
    }
  }

  // Métodos de ayuda
  
  /**
   * Actualiza el stock del producto
   * @param quantity Cantidad a añadir (puede ser negativa para restar)
   * @returns true si la operación fue exitosa, false si no hay suficiente stock
   */
  updateStock(quantity: number): boolean {
    const newStock = this.stock + quantity;
    if (newStock < 0) return false;
    this.stock = newStock;
    return true;
  }

  /**
   * Aumenta el contador de visualizaciones
   */
  incrementViewCount(): void {
    this.viewCount += 1;
  }

  /**
   * Registra una venta del producto
   * @param quantity Cantidad vendida
   */
  recordSale(quantity: number = 1): void {
    this.totalSales += quantity;
    this.stock = Math.max(0, this.stock - quantity);
  }

  /**
   * Obtiene las opciones disponibles para un tipo de variante
   * @param type Tipo de variante (color, size, etc.)
   * @returns Array con las opciones disponibles
   */
  getVariantOptions(type: VariantType): Array<{value: string, label?: string, colorCode?: string}> {
    if (!this.variants || this.variants.length === 0) return [];
    
    const variantsOfType = this.variants.filter(v => v.type === type);
    const uniqueValues = new Map<string, {value: string, label?: string, colorCode?: string}>();
    
    variantsOfType.forEach(variant => {
      if (!uniqueValues.has(variant.value)) {
        uniqueValues.set(variant.value, {
          value: variant.value,
          label: variant.name || variant.value,
          colorCode: variant.colorCode
        });
      }
    });
    
    return Array.from(uniqueValues.values());
  }

  /**
   * Obtiene una variante específica basada en sus atributos
   * @param attributes Atributos de la variante (ej: {color: 'rojo', size: 'M'})
   * @returns La variante encontrada o null
   */
  findVariant(attributes: Record<string, string>): ProductVariant | null {
    if (!this.variants || this.variants.length === 0) return null;
    
    return this.variants.find(variant => {
      return Object.entries(attributes).every(([key, value]) => {
        return variant.attributes?.[key] === value || 
               (key === 'color' && variant.colorCode === value) ||
               (key === 'size' && variant.value === value);
      });
    }) || null;
  }

  // Timestamps
  @ApiProperty({ 
    description: 'Fecha de creación del producto',
    example: '2023-01-01T00:00:00.000Z',
    readOnly: true 
  })
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de última actualización del producto',
    example: '2023-01-01T00:00:00.000Z',
    readOnly: true 
  })
  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Métodos estáticos
  
  /**
   * Crea una nueva instancia de Product con valores por defecto
   */
  static createDefault(partial?: Partial<Product>): Product {
    const product = new Product();
    product.name = '';
    product.slug = '';
    product.price = 0;
    product.salePrice = null;
    product.sku = '';
    product.stock = 0;
    product.weight = null;
    product.width = null;
    product.height = null;
    product.depth = null;
    product.isPublished = false;
    product.isFeatured = false;
    product.isOnSale = false;
    product.averageRating = 0;
    product.reviewCount = 0;
    product.totalSales = 0;
    product.viewCount = 0;
    product.categories = [];
    product.images = [];
    product.variants = [];
    product.reviews = [];
    
    if (partial) {
      Object.assign(product, partial);
    }
    
    return product;
  }
}
