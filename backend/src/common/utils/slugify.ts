/**
 * Convierte una cadena en un slug válido para URLs
 * @param text Texto a convertir
 * @returns Slug generado
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^\w\s-]/g, '') // Elimina caracteres especiales
    .replace(/\s+/g, '-') // Reemplaza espacios por guiones
    .replace(/--+/g, '-') // Reemplaza múltiples guiones por uno solo
    .trim() // Elimina espacios al inicio y final
    .replace(/^-+|-+$/g, ''); // Elimina guiones al inicio y final
}

/**
 * Genera un slug único añadiendo un sufijo numérico si es necesario
 * @param text Texto a convertir
 * @param existingSlugs Conjunto de slugs existentes
 * @returns Slug único
 */
export function generateUniqueSlug(
  text: string, 
  existingSlugs: Set<string> = new Set()
): string {
  let slug = slugify(text);
  let uniqueSlug = slug;
  let counter = 1;

  while (existingSlugs.has(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
