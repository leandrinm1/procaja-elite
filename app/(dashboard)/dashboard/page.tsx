"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase-client";
import { calculateBalance, getDayKey, formatCurrency } from "@/lib/domain";
import { Transaccion, Usuario } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const [fecha, setFecha] = useState(getDayKey());
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "usuarios", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() } as Usuario);
        }
      }
      setLoading(false);
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

    // Filter by negocio or sucursal if user is not admin
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const balance = calculateBalance(transacciones);

  const stats = [
    {
      title: "Ventas Totales",
      value: formatCurrency(balance.ventas),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Gastos",
      value: formatCurrency(balance.gastos),
      icon: TrendingDown,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Efectivo",
      value: formatCurrency(balance.efectivo),
      icon: Wallet,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Balance Total",
      value: formatCurrency(balance.total),
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Empresarial</h1>
          <p className="text-muted-foreground">
            Resumen de actividad del día
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Fecha:</label>
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {transacciones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay transacciones para esta fecha
            </div>
          ) : (
            <div className="space-y-4">
              {transacciones.slice(0, 10).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex-1">
                    <p className="font-medium">{t.detalle}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.tipo.charAt(0).toUpperCase() + t.tipo.slice(1)} •{" "}
                      {t.metodoPago.charAt(0).toUpperCase() + t.metodoPago.slice(1)}
                    </p>
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      t.tipo === "venta" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {t.tipo === "venta" ? "+" : "-"}
                    {formatCurrency(t.monto)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
