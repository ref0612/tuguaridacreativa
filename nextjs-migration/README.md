# TuGuaridaCreativa - E-commerce Platform

Bienvenido a TuGuaridaCreativa, una plataforma de comercio electrónico moderna construida con Next.js, TypeScript y Tailwind CSS.

## 🚀 Características

- **Frontend Moderno**: Desarrollado con Next.js 14, React 18 y TypeScript
- **Diseño Responsivo**: Interfaz de usuario adaptativa para todos los dispositivos
- **Rendimiento Óptimo**: Carga rápida gracias a la generación estática y renderizado del lado del servidor
- **Gestión de Estado**: Utiliza Zustand para el estado del cliente y React Query para el estado del servidor
- **Tipado Fuerte**: TypeScript para un código más seguro y mantenible
- **Estilizado**: Tailwind CSS para estilos rápidos y consistentes
- **Testing**: Configuración de pruebas con Jest, React Testing Library y Cypress
- **Linting y Formateo**: ESLint y Prettier para mantener un código limpio y consistente

## 🛠️ Requisitos Previos

- Node.js 18.0.0 o superior
- npm 9.0.0 o superior
- Git

## 🚀 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/tuguaridacreativa.git
   cd tuguaridacreativa
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.local.example .env.local
   ```
   Luego, edita el archivo `.env.local` con tus configuraciones.

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## 🧪 Ejecutando las Pruebas

```bash
# Ejecutar pruebas unitarias
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar cobertura de pruebas
npm run test:coverage

# Ejecutar pruebas E2E con Cypress (interfaz gráfica)
npm run cypress:open

# Ejecutar pruebas E2E en modo headless
npm run cypress:run
```

## 🛠️ Comandos Útiles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción (después de la construcción)
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Formatea el código con Prettier
- `npm run prepare` - Configura Husky para los hooks de Git

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # Rutas de la aplicación (App Router de Next.js)
│   ├── api/                # Rutas de la API
│   ├── (auth)/             # Rutas de autenticación
│   ├── (dashboard)/        # Rutas del panel de control
│   ├── (marketing)/        # Rutas de marketing
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página de inicio
├── components/             # Componentes reutilizables
│   ├── ui/                 # Componentes de UI puros
│   └── shared/             # Componentes compartidos
├── features/               # Características de la aplicación
│   ├── auth/               # Lógica de autenticación
│   ├── cart/               # Carrito de compras
│   ├── products/           # Productos
│   └── user/               # Perfil de usuario
├── hooks/                  # Hooks personalizados
├── lib/                    # Utilidades y configuraciones
├── services/               # Servicios API
├── stores/                 # Tiendas de Zustand
├── styles/                 # Estilos globales
└── types/                  # Tipos de TypeScript
```

## 📦 Dependencias Principales

- **Next.js** - Framework de React para aplicaciones web
- **React** - Biblioteca para construir interfaces de usuario
- **TypeScript** - JavaScript tipado
- **Tailwind CSS** - Framework CSS utilitario
- **Zustand** - Gestión de estado del cliente
- **React Query** - Gestión de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Jest** y **React Testing Library** - Pruebas unitarias
- **Cypress** - Pruebas E2E
- **ESLint** y **Prettier** - Linting y formateo de código

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee nuestra [guía de contribución](CONTRIBUTING.md) para más detalles.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ por TuGuaridaCreativa
