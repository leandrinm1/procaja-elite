# 📦 Instalación de ProCaja Elite Enterprise

## Prerrequisitos

- Node.js 18+ instalado
- Cuenta de Firebase
- Editor de código (VS Code recomendado)

## Pasos de Instalación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita Authentication (Email/Password)
4. Crea una base de datos Firestore
5. Descarga las credenciales

### 3. Configurar Variables de Entorno

Copia `.env.local.example` a `.env.local`:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales de Firebase.

### 4. Configurar Reglas de Firestore

Ve a Firestore → Reglas y copia las reglas del README.md

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 6. Crear Usuario Administrador

1. Ve a `/register`
2. Crea tu cuenta (el primer usuario será admin)
3. Inicia sesión

## Estructura del Proyecto

```
procaja-elite-enterprise/
├── app/                    # Páginas y rutas
│   ├── (auth)/            # Páginas de autenticación
│   ├── (dashboard)/       # Páginas del dashboard
│   └── api/               # API routes
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes UI básicos
│   └── dashboard/        # Componentes específicos
├── lib/                  # Utilidades y configuración
│   ├── firebase-client.ts
│   ├── firebase-admin.ts
│   ├── types.ts
│   ├── domain.ts
│   └── auth.ts
└── public/              # Archivos estáticos
```

## Despliegue

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

Configura las variables de entorno en el dashboard de Vercel.

## Soporte

Para problemas o preguntas:
- Email: soporte@procajaelite.com
- Documentación: README.md

¡Disfruta de ProCaja Elite! 🚀
