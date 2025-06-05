import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Product } from './product.entity';

@Entity('product_images')
@Index(['productId', 'isMain'])
@Index(['productId', 'order'])
export class ProductImage {
  @ApiProperty({ 
    description: 'ID único de la imagen', 
    example: '123e4567-e89b-12d3-a456-426614174000',
    readOnly: true 
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string; // Usamos el operador de aserción no nulo (!) ya que TypeORM lo inicializará

  @ApiProperty({ 
    description: 'URL de la imagen', 
    example: 'https://example.com/images/product-1.jpg',
    required: true 
  })
  @Column({ type: 'varchar', length: 500, nullable: false })
  url!: string; // Campo requerido

  @ApiPropertyOptional({ 
    description: 'URL de la miniatura de la imagen', 
    example: 'https://example.com/images/thumbnails/product-1.jpg',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string | null = null; // Valor por defecto

  @ApiProperty({ 
    description: 'Indica si esta es la imagen principal del producto', 
    example: false,
    default: false 
  })
  @Column({ type: 'boolean', default: false })
  isMain: boolean = false; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'URL de la imagen en diferentes tamaños (responsive)', 
    example: {
      small: 'https://example.com/images/small/product-1.jpg',
      medium: 'https://example.com/images/medium/product-1.jpg',
      large: 'https://example.com/images/large/product-1.jpg'
    },
    nullable: true 
  })
  @Column({ type: 'jsonb', nullable: true })
  responsiveUrls: Record<string, string> | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Texto alternativo para accesibilidad (alt text)', 
    example: 'Lienzo para pintura 40x60cm - Vista frontal',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  alt: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Título de la imagen (title attribute)', 
    example: 'Lienzo profesional 40x60cm',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Descripción detallada de la imagen', 
    example: 'Vista frontal del lienzo de algodón de 40x60cm',
    nullable: true 
  })
  @Column({ type: 'text', nullable: true })
  description: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Atributos adicionales para la imagen', 
    example: { color: 'rojo', angle: 'frontal' },
    nullable: true 
  })
  @Column({ type: 'jsonb', nullable: true })
  attributes: Record<string, any> | null = null; // Valor por defecto

  @ApiProperty({ 
    description: 'Orden de visualización', 
    example: 1,
    default: 0 
  })
  @Column({ type: 'int', default: 0 })
  order: number = 0; // Valor por defecto

  @ApiProperty({ 
    description: 'Indica si la imagen está activa', 
    example: true,
    default: true 
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean = true; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Ancho de la imagen en píxeles', 
    example: 800,
    nullable: true 
  })
  @Column({ type: 'int', nullable: true })
  width: number | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Alto de la imagen en píxeles', 
    example: 600,
    nullable: true 
  })
  @Column({ type: 'int', nullable: true })
  height: number | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Tamaño del archivo en bytes', 
    example: 102400,
    nullable: true 
  })
  @Column({ type: 'int', nullable: true })
  size: number | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Hash del archivo para detección de duplicados', 
    example: 'a1b2c3d4e5f6...',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 64, nullable: true })
  fileHash: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Nombre original del archivo', 
    example: 'lienzo-profesional.jpg',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  originalName: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Tipo MIME de la imagen', 
    example: 'image/jpeg',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Formato de la imagen', 
    example: 'jpeg',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  format: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Metadatos EXIF de la imagen', 
    example: { make: 'Canon', model: 'EOS 5D', exposure: '1/250' },
    nullable: true 
  })
  @Column({ type: 'jsonb', nullable: true })
  exif: Record<string, any> | null = null; // Valor por defecto

  // Relaciones
  @ApiProperty({ 
    description: 'Producto al que pertenece la imagen',
    type: () => Product,
    readOnly: true 
  })
  @ManyToOne(() => Product, (product) => product.images, { 
    onDelete: 'CASCADE',
    nullable: false 
  })
  @JoinColumn({ name: 'productId' })
  product!: Product; // Relación requerida

  @ApiProperty({ 
    description: 'ID del producto al que pertenece la imagen',
    example: '123e4567-e89b-12d3-a456-426614174000',
    readOnly: true 
  })
  @Column({ type: 'uuid', nullable: false })
  productId!: string; // Campo requerido

  // Timestamps
  @ApiProperty({ 
    description: 'Fecha de creación del registro',
    example: '2023-01-01T00:00:00.000Z',
    readOnly: true 
  })
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date; // TypeORM lo inicializa automáticamente

  @ApiProperty({ 
    description: 'Fecha de última actualización del registro',
    example: '2023-01-01T00:00:00.000Z',
    readOnly: true 
  })
  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date; // TypeORM lo inicializa automáticamente

  @ApiPropertyOptional({ 
    description: 'Fecha de eliminación suave (soft delete)',
    example: '2023-01-01T00:00:00.000Z',
    nullable: true,
    readOnly: true 
  })
  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null = null; // Valor por defecto

  // Métodos de ayuda
  getDimensions(): string | null {
    if (this.width && this.height) {
      return `${this.width}x${this.height}px`;
    }
    return null;
  }


  /**
   * Formatea el tamaño del archivo en una cadena legible
   * @returns Tamaño formateado (ej: '1.5 MB') o null si no hay tamaño
   */
  @ApiProperty({ 
    description: 'Tamaño del archivo formateado',
    example: '1.5 MB',
    nullable: true,
    readOnly: true 
  })
  @Expose()
  getFormattedSize(): string | null {
    if (!this.size) return null;
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = this.size;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    // Redondear a 1 decimal si es necesario
    const roundedSize = size < 10 ? Math.round(size * 10) / 10 : Math.round(size);
    return `${roundedSize} ${units[unitIndex]}`;
  }
  
  /**
   * Verifica si la imagen tiene un tamaño específico o está dentro de un rango
   * @param width Ancho a verificar (opcional)
   * @param height Alto a verificar (opcional)
   * @returns true si la imagen coincide con las dimensiones especificadas
   */
  hasDimensions(width?: number, height?: number): boolean {
    if (width !== undefined && this.width !== width) return false;
    if (height !== undefined && this.height !== height) return false;
    return true;
  }
  
  /**
   * Verifica si la imagen tiene una relación de aspecto específica
   * @param ratio Relación de aspecto (ancho/alto)
   * @param tolerance Tolerancia permitida (por defecto 0.1)
   * @returns true si la imagen tiene una relación de aspecto similar
   */
  hasAspectRatio(ratio: number, tolerance: number = 0.1): boolean {
    if (!this.width || !this.height) return false;
    const imageRatio = this.width / this.height;
    return Math.abs(imageRatio - ratio) <= tolerance;
  }
  
  // Métodos estáticos
  
  /**
   * Crea una nueva instancia de ProductImage con valores por defecto
   */
  static createDefault(partial?: Partial<ProductImage>): ProductImage {
    const image = new ProductImage();
    
    // Asignar valores por defecto
    Object.assign(image, {
      url: '',
      thumbnailUrl: null,
      isMain: false,
      responsiveUrls: null,
      alt: null,
      title: null,
      description: null,
      attributes: null,
      order: 0,
      isActive: true,
      width: null,
      height: null,
      size: null,
      fileHash: null,
      originalName: null,
      mimeType: null,
      format: null,
      exif: null,
      productId: '',
      deletedAt: null
    });
    
    // Aplicar valores parciales si se proporcionan
    if (partial) {
      Object.assign(image, partial);
    }
    
    return image;
  }
}
