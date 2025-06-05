import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  DeleteDateColumn,
  ManyToMany, 
  Tree, 
  TreeChildren, 
  TreeParent, 
  TreeLevelColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
  Index
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Product } from './product.entity';
import { slugify } from '../../../common/utils/slugify';

@Entity('categories')
@Tree('materialized-path')
export class Category {
  @ApiProperty({ 
    description: 'ID único de la categoría', 
    example: '123e4567-e89b-12d3-a456-426614174000',
    readOnly: true 
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string; // Usamos el operador de aserción no nulo (!) ya que TypeORM lo inicializará

  @ApiProperty({ description: 'Nombre de la categoría', example: 'Pinturas' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string; // Campo requerido

  @ApiProperty({ 
    description: 'Slug único para URLs amigables', 
    example: 'pinturas',
    readOnly: true 
  })
  @Column({ type: 'varchar', length: 100, unique: true })
  @Index()
  slug!: string; // Campo requerido, generado automáticamente si no se proporciona

  @ApiProperty({ description: 'Descripción de la categoría', example: 'Materiales de pintura para artistas' })
  @Column({ type: 'text', nullable: true })
  description: string = ''; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'URL de la imagen de la categoría', 
    example: 'https://example.com/images/pinturas.jpg',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'URL de la miniatura de la categoría', 
    example: 'https://example.com/images/thumbnails/pinturas.jpg',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnail: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Metadatos SEO: Título para SEO', 
    example: 'Pinturas profesionales para artistas - Tienda de Arte',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  metaTitle: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Metadatos SEO: Descripción para SEO', 
    example: 'Encuentra las mejores pinturas profesionales para tus obras de arte. Gran variedad de colores y marcas.',
    nullable: true 
  })
  @Column({ type: 'text', nullable: true })
  metaDescription: string | null = null; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Metadatos SEO: Palabras clave para SEO', 
    example: 'pinturas, arte, materiales artísticos, colores, lienzos',
    nullable: true 
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  metaKeywords: string | null = null; // Valor por defecto

  @ApiProperty({ description: 'Orden de visualización', example: 1 })
  @Column({ type: 'int', default: 0 })
  order: number = 0; // Valor por defecto

  @ApiProperty({ 
    description: 'Indica si la categoría está activa', 
    example: true,
    default: true 
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean = true; // Valor por defecto

  @ApiProperty({ 
    description: 'Indica si la categoría está destacada', 
    example: false,
    default: false 
  })
  @Column({ type: 'boolean', default: false })
  isFeatured: boolean = false; // Valor por defecto

  @ApiPropertyOptional({ 
    description: 'Fecha de eliminación suave (soft delete)',
    example: '2023-01-01T00:00:00.000Z',
    nullable: true,
    readOnly: true 
  })
  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null = null; // Valor por defecto

  // Relaciones
  @ApiProperty({ 
    description: 'Productos asociados a esta categoría',
    type: () => [Product],
    isArray: true,
    readOnly: true 
  })
  @ManyToMany(() => Product, (product) => product.categories, {
    onDelete: 'CASCADE'
  })
  products: Product[] = []; // Inicializar array vacío

  @ApiProperty({ 
    description: 'Subcategorías de esta categoría',
    type: () => [Category],
    isArray: true,
    readOnly: true 
  })
  @TreeChildren()
  children: Category[] = []; // Inicializar array vacío

  @ApiProperty({ 
    description: 'Categoría padre',
    type: () => Category,
    nullable: true,
    readOnly: true 
  })
  @TreeParent()
  parent: Category | null = null; // Valor por defecto

  @ApiProperty({ 
    description: 'Nivel en la jerarquía de categorías',
    example: 0,
    readOnly: true 
  })
  @TreeLevelColumn()
  level: number = 0; // Valor por defecto

  @ApiProperty({ 
    description: 'Ruta completa de la categoría en el árbol',
    example: 'Arte>Pinturas>Óleos',
    readOnly: true 
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  path: string | null = null; // Valor por defecto

  // Timestamps
  @ApiProperty({ 
    description: 'Fecha de creación de la categoría',
    example: '2023-01-01T00:00:00.000Z',
    readOnly: true 
  })
  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date; // TypeORM lo inicializa automáticamente

  @ApiProperty({ 
    description: 'Fecha de última actualización de la categoría',
    example: '2023-01-01T00:00:00.000Z',
    readOnly: true 
  })
  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date; // TypeORM lo inicializa automáticamente

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  generateSlugAndPath() {
    // Generar slug si no existe
    if (this.name && !this.slug) {
      this.slug = slugify(this.name);
    }

    // Actualizar la ruta completa
    this.updatePath();
  }

  @AfterLoad()
  afterLoad() {
    // Asegurarse de que los campos calculados estén actualizados
    this.updatePath();
  }

  // Métodos de ayuda
  
  /**
   * Actualiza la ruta completa de la categoría en el árbol
   */
  private updatePath(): void {
    if (this.parent) {
      const parentPath = this.parent.path || '';
      this.path = parentPath ? `${parentPath} > ${this.name}` : this.name;
    } else {
      this.path = this.name;
    }
  }

  /**
   * Agrega un producto a la categoría
   * @param product Producto a agregar
   */
  addProduct(product: Product): void {
    if (!this.products) {
      this.products = [];
    }
    
    const exists = this.products.some(p => p.id === product.id);
    if (!exists) {
      this.products.push(product);
    }
  }

  /**
   * Elimina un producto de la categoría
   * @param productId ID del producto a eliminar
   * @returns true si se eliminó el producto, false si no existía
   */
  removeProduct(productId: string): boolean {
    if (!this.products) return false;
    
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== productId);
    return this.products.length < initialLength;
  }

  /**
   * Verifica si la categoría es descendiente de otra categoría
   * @param categoryId ID de la categoría a verificar como ancestro
   */
  isDescendantOf(categoryId: string): boolean {
    if (!this.parent) return false;
    if (this.parent.id === categoryId) return true;
    return this.parent.isDescendantOf(categoryId);
  }

  /**
   * Obtiene la cantidad total de productos en esta categoría y sus subcategorías
   */
  getTotalProductCount(includeChildren: boolean = true): number {
    let count = this.products?.length || 0;
    
    if (includeChildren && this.children) {
      this.children.forEach(child => {
        count += child.getTotalProductCount(includeChildren);
      });
    }
    
    return count;
  }

  // Métodos estáticos
  
  /**
   * Crea una nueva instancia de Category con valores por defecto
   */
  static createDefault(partial?: Partial<Category>): Category {
    const category = new Category();
    
    // Asignar valores por defecto
    Object.assign(category, {
      name: '',
      slug: '',
      description: '',
      image: null,
      thumbnail: null,
      metaTitle: null,
      metaDescription: null,
      metaKeywords: null,
      order: 0,
      isActive: true,
      isFeatured: false,
      deletedAt: null,
      products: [],
      children: [],
      parent: null,
      level: 0,
      path: null
    });
    
    // Aplicar valores parciales si se proporcionan
    if (partial) {
      Object.assign(category, partial);
    }
    
    return category;
  }
}
