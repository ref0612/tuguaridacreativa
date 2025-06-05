import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';
import { User } from '../../users/entities/user.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('reviews')
@Index(['productId', 'userId'], { unique: true }) // Un usuario solo puede dejar una reseña por producto
export class Review {
  @ApiProperty({ description: 'ID único de la reseña', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Título de la reseña', example: 'Excelente producto' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ description: 'Contenido detallado de la reseña', example: 'El producto superó mis expectativas...' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ 
    description: 'Calificación (1-5 estrellas)', 
    example: 5,
    minimum: 1,
    maximum: 5 
  })
  @Column({ type: 'int', nullable: false })
  rating: number;

  @ApiProperty({ description: 'Ventajas del producto', example: 'Buena calidad, fácil de usar' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  pros: string | null;

  @ApiProperty({ description: 'Desventajas del producto', example: 'El color es un poco diferente al de la foto' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  cons: string | null;

  @ApiProperty({ 
    description: 'Estado de la reseña', 
    enum: ReviewStatus,
    enumName: 'ReviewStatus',
    example: ReviewStatus.APPROVED 
  })
  @Column({ 
    type: 'enum', 
    enum: ReviewStatus, 
    default: ReviewStatus.PENDING 
  })
  status: ReviewStatus;

  @ApiProperty({ description: 'Indica si la reseña fue escrita por un comprador verificado', example: true })
  @Column({ type: 'boolean', default: false })
  isVerifiedPurchase: boolean;

  @ApiProperty({ description: 'Número de votos útiles', example: 12 })
  @Column({ type: 'int', default: 0 })
  helpfulVotes: number;

  @ApiProperty({ description: 'Número de votos no útiles', example: 2 })
  @Column({ type: 'int', default: 0 })
  unhelpfulVotes: number;

  // Relaciones
  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  productId: string;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  // Timestamps
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Métodos de ayuda
  markHelpful(): void {
    this.helpfulVotes += 1;
  }


  markUnhelpful(): void {
    this.unhelpfulVotes += 1;
  }

  approve(): void {
    this.status = ReviewStatus.APPROVED;
  }

  reject(): void {
    this.status = ReviewStatus.REJECTED;
  }

  isApproved(): boolean {
    return this.status === ReviewStatus.APPROVED;
  }

  getHelpfulPercentage(): number {
    const totalVotes = this.helpfulVotes + this.unhelpfulVotes;
    if (totalVotes === 0) return 0;
    return Math.round((this.helpfulVotes / totalVotes) * 100);
  }
}
