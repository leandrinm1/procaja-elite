# 🚀 Inicio Rápido - ProCaja Elite Enterprise

## Instalación en 5 minutos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase

**Opción A: Crear nuevo proyecto**
1. Visita https://console.firebase.google.com/
2. Crea un nuevo proyecto
3. Habilita Authentication > Email/Password
4. Crea Firestore Database
5. Copia credenciales

**Opción B: Usar proyecto existente**
- Salta al paso 3

### 3. Variables de entorno
```bash
cp .env.example .env.local
# Edita .env.local con tus credenciales
```

### 4. Ejecutar
```bash
npm run dev
```

### 5. Abrir navegador
```
http://localhost:3000
```

## 🎯 Primera vez

1. **Registrarse**: `/register`
   - Email: admin@tuempresa.com
   - Contraseña: mínimo 6 caracteres
   - Nombre: Tu nombre
   - Negocio: Tu empresa

2. **Dashboard**: Automáticamente creado con:
   - Tu usuario Admin
   - Tu negocio
   - Sucursal principal

3. **Primera transacción**: 
   - Ve a Transacciones
   - Registra una venta o gasto
   - ¡Listo!

## 📝 Reglas de Firestore

**IMPORTANTE**: Copia estas reglas en Firebase Console > Firestore > Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/usuarios/$(request.auth.uid)).data;
    }
    
    function belongsToUserBusiness(negocioId) {
      return isAuthenticated() && getUserData().negocioId == negocioId;
    }
    
    match /usuarios/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && request.auth.uid == userId;
    }
    
    match /negocios/{negocioId} {
      allow read, write: if belongsToUserBusiness(negocioId);
    }
    
    match /sucursales/{sucursalId} {
      allow read, write: if belongsToUserBusiness(resource.data.negocioId);
    }
    
    match /transacciones/{transaccionId} {
      allow read: if belongsToUserBusiness(resource.data.negocioId);
      allow create: if isAuthenticated() && belongsToUserBusiness(request.resource.data.negocioId);
      allow update, delete: if belongsToUserBusiness(resource.data.negocioId);
    }
    
    match /empleados/{empleadoId} {
      allow read, write: if belongsToUserBusiness(resource.data.negocioId);
    }
  }
}
```

## 🔧 Solución de problemas comunes

### Firebase no inicializa
```bash
# Verifica .env.local
cat .env.local
# Reinicia el servidor
npm run dev
```

### No se ven las transacciones
1. Verifica las reglas de Firestore
2. Revisa la consola del navegador (F12)
3. Verifica que creaste el índice:
   - negocioId + dayKey + fechaISO

### Error de permisos
- Copia las reglas de Firestore correctamente
- Asegúrate de estar autenticado

## ✨ Siguientes pasos

1. Personaliza el nombre y logo
2. Agrega más usuarios
3. Crea sucursales adicionales
4. Explora los reportes
5. Configura el cierre de caja

## 💡 Tips

- Usa categorías para organizar transacciones
- Registra todas las operaciones diariamente
- Revisa el balance al final del día
- Exporta reportes mensuales

¡Listo para empezar! 🎉
