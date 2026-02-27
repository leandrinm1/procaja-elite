"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/lib/hooks/useAuth";
import { getDayKey } from "@/lib/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { TipoTransaccion, MetodoPago } from "@/lib/types";

export default function TransaccionesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [tipo, setTipo] = useState<TipoTransaccion>("venta");
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("efectivo");
  const [detalle, setDetalle] = useState("");
  const [categoria, setCategoria] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user || !monto || !detalle) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      toast.error("El monto debe ser un número positivo");
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      await addDoc(collection(db, "transacciones"), {
        negocioId: user.negocioId,
        sucursalId: user.sucursalId || user.negocioId,
        tipo,
        monto: montoNum,
        metodoPago,
        detalle,
        categoria: categoria || null,
        userId: user.id,
        userName: user.nombre,
        fechaISO: now.toISOString(),
        dayKey: getDayKey(now),
        createdAt: now,
        updatedAt: now,
      });

      toast.success("Transacción registrada exitosamente");
      
      // Reset form
      setMonto("");
      setDetalle("");
      setCategoria("");
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Error al registrar la transacción");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Transacciones</h1>
        <p className="text-slate-400">Registra ventas, gastos e ingresos</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card className="border-slate-700">
          <CardHeader>
            <CardTitle>Nueva Transacción</CardTitle>
            <CardDescription>
              Completa el formulario para registrar una nueva transacción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Transacción *</Label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as TipoTransaccion)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={loading}
                >
                  <option value="venta">Venta</option>
                  <option value="gasto">Gasto</option>
                  <option value="ingreso">Ingreso</option>
                  <option value="retiro">Retiro</option>
                  <option value="nomina">Nómina</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto">Monto (USD) *</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  placeholder="100.00"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metodoPago">Método de Pago *</Label>
                <select
                  id="metodoPago"
                  value={metodoPago}
                  onChange={(e) =>
                    setMetodoPago(e.target.value as MetodoPago)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={loading}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detalle">Descripción *</Label>
                <Input
                  id="detalle"
                  placeholder="Ej: Venta de producto X"
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría (Opcional)</Label>
                <Input
                  id="categoria"
                  placeholder="Ej: Productos, Servicios, Suministros"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  disabled={loading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Transacción"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card className="border-slate-700">
            <CardHeader>
              <CardTitle>Resumen Rápido</CardTitle>
              <CardDescription>Tips para registrar transacciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuickTip
                title="Ventas"
                description="Registra todas las ventas realizadas, especificando el método de pago."
              />
              <QuickTip
                title="Gastos"
                description="Incluye compras, suministros, servicios y cualquier salida de dinero."
              />
              <QuickTip
                title="Ingresos"
                description="Otros ingresos que no sean ventas directas (préstamos, inversiones, etc)."
              />
              <QuickTip
                title="Retiros"
                description="Dinero retirado de la caja para banco o uso personal."
              />
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="text-green-500">Categorías</CardTitle>
              <CardDescription>
                Usa categorías para organizar mejor tus transacciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-slate-300">
                <p>• Productos</p>
                <p>• Servicios</p>
                <p>• Suministros</p>
                <p>• Marketing</p>
                <p>• Transporte</p>
                <p>• Otros</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickTip({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-slate-700 p-3">
      <h4 className="mb-1 font-medium text-white">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
