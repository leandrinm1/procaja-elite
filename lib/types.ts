import { Timestamp } from 'firebase/firestore';

export type Rol = 'admin' | 'gerente' | 'cajero';

export type TipoTransaccion = 'venta' | 'gasto' | 'retiro';

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia';

export interface Usuario {
  uid: string;
  email: string;
  nombre: string;
  rol: Rol;
  negocioId?: string;
  sucursalId?: string;
  activo: boolean;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface Negocio {
  id: string;
  nombre: string;
  propietarioUid: string;
  activo: boolean;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface Sucursal {
  id: string;
  negocioId: string;
  nombre: string;
  direccion: string;
  telefono?: string;
  activo: boolean;
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export interface Transaccion {
  id: string;
  negocioId: string;
  sucursalId: string;
  tipo: TipoTransaccion;
  monto: number;
  detalle: string;
  metodoPago: MetodoPago;
  usuarioUid: string;
  usuarioNombre?: string;
  fechaISO: string;
  dayKey: string; // Format: YYYY-MM-DD
  createdAt: Timestamp | Date;
}

export interface Cierre {
  id: string;
  negocioId: string;
  sucursalId: string;
  dayKey: string;
  totalVentas: number;
  totalGastos: number;
  totalRetiros: number;
  efectivoInicial: number;
  efectivoFinal: number;
  ventasEfectivo: number;
  ventasTarjeta: number;
  ventasTransferencia: number;
  transaccionesCount: number;
  cerradoPor: string;
  cerradoPorNombre: string;
  notas?: string;
  createdAt: Timestamp | Date;
}

export interface Auditoria {
  id: string;
  usuarioUid: string;
  usuarioNombre: string;
  accion: string;
  entidad: string;
  entidadId: string;
  detalles: any;
  ip?: string;
  userAgent?: string;
  createdAt: Timestamp | Date;
}

export interface Balance {
  ventas: number;
  gastos: number;
  retiros: number;
  efectivo: number;
  tarjeta: number;
  transferencia: number;
  total: number;
}

export interface EstadisticasDia {
  fecha: string;
  ventas: number;
  transacciones: number;
}
