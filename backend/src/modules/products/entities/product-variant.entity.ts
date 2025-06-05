import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

export enum VariantType {
  COLOR = 'color',
  SIZE = 'size',
  MATERIAL = 'material',
  STYLE = 'style',
  OTHER = 'other',
}

@Entity('product_variants')
export class ProductVariant {
  @ApiProperty({ description: 'ID único de la variante', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre de la variante', example: 'Color' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ApiProperty({ 
    description: 'Tipo de variante', 
    example: 'color', 
    enum: VariantType,
    enumName: 'VariantType' 
  })
  @Column({ 
    type: 'enum', 
    enum: VariantType, 
    default: VariantType.OTHER 
  })
  type: VariantType;

  @ApiProperty({ description: 'Valor de la variante', example: 'Rojo' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  value: string;

  @ApiProperty({ description: 'Código de color (si aplica)', example: '#FF0000' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  colorCode: string | null;

  @ApiProperty({ description: 'SKU único de la variante', example: 'LIENZO-40X60-RED' })
  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @ApiProperty({ description: 'Precio adicional (puede ser negativo para descuentos)', example: 5.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  priceAdjustment: number;

  @ApiProperty({ description: 'Cantidad en inventario', example: 50 })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({ description: 'Peso adicional en gramos', example: 100 })
  @Column({ type: 'int', default: 0 })
  weight: number;

  @ApiProperty({ description: 'Imagen específica para esta variante (opcional)', example: 'https://example.com/images/red-canvas.jpg' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string | null;

  @ApiProperty({ description: 'Indica si esta variante está activa', example: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relaciones
  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  productId: string;

  // Timestamps
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Propiedades calculadas
  get totalPrice(): number {
    return this.product ? this.product.price + this.priceAdjustment : 0;
  }

  // Métodos de ayuda
  updateStock(quantity: number): boolean {
    if (this.stock + quantity < 0) {
      return false; // No hay suficiente stock
    }
    this.stock += quantity;
    return true;
  }

  hasStock(quantity: number = 1): boolean {
    return this.stock >= quantity;
  }
}
