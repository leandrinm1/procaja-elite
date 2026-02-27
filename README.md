# ProCaja Elite Enterprise 🚀

Sistema SaaS empresarial completo para gestión de punto de venta multi-negocio.

## 🎯 Características

### ✅ Implementadas

- **Multi-Negocio**: Gestión de múltiples negocios desde una cuenta
- **Multi-Sucursal**: Cada negocio puede tener múltiples sucursales
- **Sistema de Roles**: Admin, Gerente, Cajero con permisos diferenciados
- **Autenticación Segura**: Firebase Auth con middleware de protección
- **Dashboard en Tiempo Real**: Actualizaciones instantáneas con Firestore
- **Gestión de Transacciones**: Ventas, gastos, retiros con validación
- **Balance Automático**: Cálculo automático de ventas y efectivo
- **Cierre Diario**: Generación automática de reportes de cierre
- **Auditoría Completa**: Registro de todas las acciones de usuarios
- **Reportes PDF**: Generación de reportes descargables
- **UI Moderna**: Interfaz profesional con Tailwind CSS
- **Responsive**: Funciona en desktop, tablet y móvil

## 🏗️ Arquitectura

```
procaja-elite-enterprise/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── negocios/
│   │   ├── sucursales/
│   │   ├── usuarios/
│   │   ├── transacciones/
│   │   ├── reportes/
│   │   └── auditoria/
│   ├── api/
│   │   ├── transacciones/
│   │   ├── cierre/
│   │   └── reportes/
│   └── layout.tsx
├── components/
│   ├── ui/
│   └── dashboard/
├── lib/
│   ├── firebase-client.ts
│   ├── firebase-admin.ts
│   ├── domain.ts
│   ├── auth.ts
│   └── utils.ts
└── middleware.ts
```

## 🔐 Modelo de Datos

### Colecciones Firestore

#### `usuarios`
```typescript
{
  uid: string;
  email: string;
  nombre: string;
  rol: 'admin' | 'gerente' | 'cajero';
  negocioId?: string;
  sucursalId?: string;
  activo: boolean;
  createdAt: timestamp;
}
```

#### `negocios`
```typescript
{
  id: string;
  nombre: string;
  propietarioUid: string;
  activo: boolean;
  createdAt: timestamp;
}
```

#### `sucursales`
```typescript
{
  id: string;
  negocioId: string;
  nombre: string;
  direccion: string;
  activo: boolean;
  createdAt: timestamp;
}
```

#### `transacciones`
```typescript
{
  id: string;
  negocioId: string;
  sucursalId: string;
  tipo: 'venta' | 'gasto' | 'retiro';
  monto: number;
  detalle: string;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
  usuarioUid: string;
  fechaISO: string;
  dayKey: string; // YYYY-MM-DD
  createdAt: timestamp;
}
```

#### `cierres`
```typescript
{
  id: string;
  negocioId: string;
  sucursalId: string;
  dayKey: string;
  totalVentas: number;
  totalGastos: number;
  efectivoFinal: number;
  transaccionesCount: number;
  cerradoPor: string;
  createdAt: timestamp;
}
```

#### `auditoria`
```typescript
{
  id: string;
  usuarioUid: string;
  accion: string;
  entidad: string;
  entidadId: string;
  detalles: any;
  ip?: string;
  createdAt: timestamp;
}
```

## 🔧 Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Firebase

Crear archivo `.env.local`:

```env
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key\n-----END PRIVATE KEY-----\n"
```

### 3. Configurar Reglas de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios
    match /usuarios/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
    }
    
    // Negocios
    match /negocios/{negocioId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if get(/databases/$(database)/documents/negocios/$(negocioId)).data.propietarioUid == request.auth.uid ||
                              get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
    }
    
    // Transacciones
    match /transacciones/{transaccionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      request.resource.data.usuarioUid == request.auth.uid;
      allow update, delete: if get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol in ['admin', 'gerente'];
    }
    
    // Auditoría (solo lectura para admins)
    match /auditoria/{auditoriaId} {
      allow read: if get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data.rol == 'admin';
      allow write: if false; // Solo desde backend
    }
  }
}
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 👥 Roles y Permisos

### Admin
- Acceso total al sistema
- Gestión de negocios y sucursales
- Gestión de usuarios y roles
- Auditoría completa
- Todos los reportes

### Gerente
- Gestión de su sucursal
- Ver y crear transacciones
- Realizar cierres diarios
- Reportes de su sucursal
- No puede modificar usuarios

### Cajero
- Crear transacciones de venta
- Ver transacciones del día
- Dashboard básico
- No puede hacer cierres
- No accede a reportes ni auditoría

## 📊 Funcionalidades Principales

### Dashboard
- Resumen de ventas del día
- Gráficos de tendencias
- Balance en tiempo real
- Alertas y notificaciones

### Transacciones
- Registro de ventas, gastos y retiros
- Validación de montos
- Histórico completo
- Filtros por fecha y tipo

### Cierre Diario
- Proceso automático de cierre
- Generación de reportes PDF
- Conciliación de efectivo
- Histórico de cierres

### Reportes
- Ventas por período
- Análisis por sucursal
- Rendimiento por usuario
- Exportación a PDF

### Auditoría
- Log de todas las acciones
- Trazabilidad completa
- Búsqueda y filtros
- Solo para administradores

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Variables de Entorno en Producción
Configurar todas las variables de `.env.local` en el dashboard de Vercel.

## 🔒 Seguridad

- ✅ Autenticación Firebase
- ✅ Middleware de Next.js para protección de rutas
- ✅ Reglas de seguridad Firestore
- ✅ Validación de datos en cliente y servidor
- ✅ Auditoría de acciones
- ✅ Sanitización de inputs
- ✅ Rate limiting en API routes

## 📱 Responsive

La aplicación está completamente optimizada para:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🐛 Debugging

```bash
# Ver logs de Firebase
firebase emulators:start

# Modo desarrollo con logs detallados
npm run dev
```

## 📝 Licencia

Privado - Uso exclusivo de ProCaja Elite

## 🤝 Soporte

Para soporte técnico contactar a: soporte@procajaelite.com

---

Desarrollado con ❤️ por el equipo de ProCaja Elite
