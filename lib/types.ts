export interface User { id?: string; uid?: string; email?: string | null; displayName?: string | null; role?: string; [key: string]: any; }
export interface Usuario { id?: string; uid?: string; email?: string | null; nombre?: string | null; rol?: string; [key: string]: any; }
export interface Transaccion { id?: string; tipo: string; monto: number; fecha: any; descripcion?: string; detalle: string; metodoPago: string; [key: string]: any; }
