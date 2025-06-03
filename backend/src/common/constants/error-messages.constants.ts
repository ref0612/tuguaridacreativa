// Mensajes de error comunes
export const ERROR_MESSAGES = {
  // Errores de autenticación
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',
  INVALID_TOKEN: 'Token inválido o expirado',
  INVALID_REFRESH_TOKEN: 'Token de actualización inválido',
  TOKEN_EXPIRED: 'Token expirado',
  REFRESH_TOKEN_REQUIRED: 'Token de actualización requerido',
  
  // Errores de validación
  VALIDATION_ERROR: 'Error de validación',
  INVALID_EMAIL: 'Correo electrónico inválido',
  INVALID_PASSWORD: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  
  // Errores de usuario
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_ALREADY_EXISTS: 'El correo electrónico ya está en uso',
  USER_INACTIVE: 'Usuario inactivo',
  INVALID_USER_ROLE: 'Rol de usuario no válido',
  
  // Errores de base de datos
  DATABASE_ERROR: 'Error en la base de datos',
  
  // Errores de servidor
  INTERNAL_SERVER_ERROR: 'Error interno del servidor',
  
  // Errores de validación de solicitud
  BAD_REQUEST: 'Solicitud incorrecta',
  MISSING_FIELDS: 'Faltan campos requeridos',
  
  // Errores de permisos
  PERMISSION_DENIED: 'No tiene permisos para realizar esta acción',
  
  // Errores de recurso no encontrado
  RESOURCE_NOT_FOUND: 'Recurso no encontrado',
  
  // Errores de archivos
  FILE_TOO_LARGE: 'El archivo es demasiado grande',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido',
  
  // Errores de correo electrónico
  EMAIL_SEND_ERROR: 'Error al enviar el correo electrónico',
  
  // Errores de negocio
  INSUFFICIENT_STOCK: 'Stock insuficiente',
  ORDER_ALREADY_PROCESSED: 'La orden ya ha sido procesada',
  
  // Errores de pago
  PAYMENT_ERROR: 'Error al procesar el pago',
  PAYMENT_DECLINED: 'Pago rechazado',
  
  // Errores de autenticación de dos factores
  INVALID_2FA_CODE: 'Código de autenticación de dos factores inválido',
  TWO_FACTOR_REQUIRED: 'Se requiere autenticación de dos factores',
};
