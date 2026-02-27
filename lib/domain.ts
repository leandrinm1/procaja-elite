import { Transaccion, Balance } from './types';

export function calculateBalance(transacciones: Transaccion[]): Balance {
  const balance: Balance = {
    ventas: 0,
    gastos: 0,
    retiros: 0,
    efectivo: 0,
    tarjeta: 0,
    transferencia: 0,
    total: 0,
  };

  transacciones.forEach((t) => {
    // Sumar por tipo
    if (t.tipo === 'venta') {
      balance.ventas += t.monto;
    } else if (t.tipo === 'gasto') {
      balance.gastos += t.monto;
    } else if (t.tipo === 'retiro') {
      balance.retiros += t.monto;
    }

    // Sumar por método de pago (solo ventas)
    if (t.tipo === 'venta') {
      if (t.metodoPago === 'efectivo') {
        balance.efectivo += t.monto;
      } else if (t.metodoPago === 'tarjeta') {
        balance.tarjeta += t.monto;
      } else if (t.metodoPago === 'transferencia') {
        balance.transferencia += t.monto;
      }
    }

    // Restar gastos y retiros del efectivo
    if (t.tipo === 'gasto' || t.tipo === 'retiro') {
      balance.efectivo -= t.monto;
    }
  });

  balance.total = balance.ventas - balance.gastos - balance.retiros;

  return balance;
}

export function getDayKey(date?: Date): string {
  const d = date || new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function validateMonto(monto: number): boolean {
  return monto > 0 && Number.isFinite(monto);
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function canUserAccessNegocio(
  userRole: string,
  userNegocioId: string | undefined,
  targetNegocioId: string
): boolean {
  if (userRole === 'admin') return true;
  return userNegocioId === targetNegocioId;
}

export function canUserAccessSucursal(
  userRole: string,
  userSucursalId: string | undefined,
  targetSucursalId: string
): boolean {
  if (userRole === 'admin' || userRole === 'gerente') return true;
  return userSucursalId === targetSucursalId;
}

export function canUserPerformAction(
  userRole: string,
  action: 'create' | 'read' | 'update' | 'delete',
  entity: 'transaccion' | 'cierre' | 'usuario' | 'negocio' | 'sucursal'
): boolean {
  const permissions: Record<string, Record<string, string[]>> = {
    admin: {
      transaccion: ['create', 'read', 'update', 'delete'],
      cierre: ['create', 'read', 'update', 'delete'],
      usuario: ['create', 'read', 'update', 'delete'],
      negocio: ['create', 'read', 'update', 'delete'],
      sucursal: ['create', 'read', 'update', 'delete'],
    },
    gerente: {
      transaccion: ['create', 'read', 'update', 'delete'],
      cierre: ['create', 'read'],
      usuario: ['read'],
      negocio: ['read'],
      sucursal: ['read'],
    },
    cajero: {
      transaccion: ['create', 'read'],
      cierre: ['read'],
      usuario: [],
      negocio: ['read'],
      sucursal: ['read'],
    },
  };

  return permissions[userRole]?.[entity]?.includes(action) || false;
}
