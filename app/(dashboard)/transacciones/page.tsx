"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase-client";
import { getDayKey, formatCurrency, validateMonto } from "@/lib/domain";
import { Transaccion, Usuario } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export default function TransaccionesPage() {
  const [fecha, setFecha] = useState(getDayKey());
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [user, setUser] = useState<Usuario | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "venta" as "venta" | "gasto" | "retiro",
    monto: "",
    detalle: "",
    metodoPago: "efectivo" as "efectivo" | "tarjeta" | "transferencia",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "usuarios", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as Usuario);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    let q = query(
      collection(db, "transacciones"),
      where("dayKey", "==", fecha),
      orderBy("fechaISO", "desc")
    );

    if (user.rol !== "admin" && user.negocioId) {
      q = query(
        collection(db, "transacciones"),
        where("dayKey", "==", fecha),
        where("negocioId", "==", user.negocioId),
        orderBy("fechaISO", "desc")
      );
    }

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaccion[];
      setTransacciones(data);
    });

    return () => unsub();
  }, [fecha, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const monto = parseFloat(formData.monto);

    if (!validateMonto(monto)) {
      alert("Ingresa un monto válido");
      return;
    }

    if (!formData.detalle.trim()) {
      alert("Ingresa un detalle");
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      await addDoc(collection(db, "transacciones"), {
        negocioId: user?.negocioId || "default",
        sucursalId: user?.sucursalId || "default",
        tipo: formData.tipo,
        monto,
        detalle: formData.detalle,
        metodoPago: formData.metodoPago,
        usuarioUid: user?.uid,
        usuarioNombre: user?.nombre,
        fechaISO: now.toISOString(),
        dayKey: getDayKey(now),
        createdAt: now,
      });

      setFormData({
        tipo: "venta",
        monto: "",
        detalle: "",
        metodoPago: "efectivo",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Error al guardar la transacción");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transacciones</h1>
          <p className="text-muted-foreground">
            Gestiona ventas, gastos y retiros
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-auto"
          />
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Transacción
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Transacción</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo</label>
                  <select
                    className="input-field"
                    value={formData.tipo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo: e.target.value as any,
                      })
                    }
                  >
                    <option value="venta">Venta</option>
                    <option value="gasto">Gasto</option>
                    <option value="retiro">Retiro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monto</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.monto}
                    onChange={(e) =>
                      setFormData({ ...formData, monto: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Método de Pago</label>
                  <select
                    className="input-field"
                    value={formData.metodoPago}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metodoPago: e.target.value as any,
                      })
                    }
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Detalle</label>
                  <Input
                    type="text"
                    placeholder="Descripción"
                    value={formData.detalle}
                    onChange={(e) =>
                      setFormData({ ...formData, detalle: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Listado de Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          {transacciones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay transacciones para esta fecha
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tipo</th>
                    <th className="text-left py-3 px-4">Detalle</th>
                    <th className="text-left py-3 px-4">Método</th>
                    <th className="text-right py-3 px-4">Monto</th>
                    <th className="text-left py-3 px-4">Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {transacciones.map((t) => (
                    <tr key={t.id} className="border-b">
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            t.tipo === "venta"
                              ? "bg-green-500/10 text-green-500"
                              : t.tipo === "gasto"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}
                        >
                          {t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">{t.detalle}</td>
                      <td className="py-3 px-4 capitalize">{t.metodoPago}</td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {formatCurrency(t.monto)}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {t.usuarioNombre || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
