"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { useAuth } from "@/lib/hooks/useAuth";
import { calculateBalance, formatCurrency, getDayKey } from "@/lib/domain";
import { Transaccion } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [fecha, setFecha] = useState(getDayKey());
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.negocioId) return;

    setLoading(true);
    const q = query(
      collection(db, "transacciones"),
      where("negocioId", "==", user.negocioId),
      where("dayKey", "==", fecha),
      orderBy("fechaISO", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Transaccion)
      );
      setTransacciones(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.negocioId, fecha]);

  const balance = calculateBalance(transacciones);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">
            Resumen de operaciones del día
          </p>
        </div>
        <div className="w-48">
          <Label htmlFor="fecha" className="text-slate-300">
            Fecha
          </Label>
          <Input
            id="fecha"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ventas Total"
          value={formatCurrency(balance.totalVentas)}
          icon={<DollarSign className="h-6 w-6" />}
          trend="positive"
          className="border-green-500/20 bg-green-500/5"
        />
        <StatCard
          title="Gastos Total"
          value={formatCurrency(balance.totalGastos)}
          icon={<TrendingDown className="h-6 w-6" />}
          trend="negative"
          className="border-red-500/20 bg-red-500/5"
        />
        <StatCard
          title="Balance Neto"
          value={formatCurrency(balance.balanceNeto)}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={balance.balanceNeto >= 0 ? "positive" : "negative"}
          className="border-blue-500/20 bg-blue-500/5"
        />
        <StatCard
          title="Efectivo"
          value={formatCurrency(balance.efectivo)}
          icon={<Wallet className="h-6 w-6" />}
          className="border-purple-500/20 bg-purple-500/5"
        />
      </div>

      {/* Payment Methods */}
      <Card className="border-slate-700">
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
          <CardDescription>Distribución de ingresos por método</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PaymentMethodCard
              method="Efectivo"
              amount={balance.efectivo}
              icon={<Wallet className="h-5 w-5" />}
            />
            <PaymentMethodCard
              method="Tarjeta"
              amount={balance.tarjeta}
              icon={<CreditCard className="h-5 w-5" />}
            />
            <PaymentMethodCard
              method="Transferencia"
              amount={balance.transferencia}
              icon={<DollarSign className="h-5 w-5" />}
            />
            <PaymentMethodCard
              method="Crédito"
              amount={balance.credito}
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-slate-700">
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>
            Últimas {transacciones.length} transacciones del día
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-slate-400">Cargando...</div>
          ) : transacciones.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No hay transacciones para esta fecha
            </div>
          ) : (
            <div className="space-y-2">
              {transacciones.slice(0, 10).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg border border-slate-700 p-3 hover:bg-slate-800"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{t.detalle}</p>
                    <p className="text-sm text-slate-400">
                      {t.tipo} • {t.metodoPago} • {t.userName}
                    </p>
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      t.tipo === "venta" || t.tipo === "ingreso"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {t.tipo === "venta" || t.tipo === "ingreso" ? "+" : "-"}
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

function StatCard({
  title,
  value,
  icon,
  trend,
  className,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: "positive" | "negative";
  className?: string;
}) {
  return (
    <Card className={`border ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          {title}
        </CardTitle>
        <div
          className={`${
            trend === "positive"
              ? "text-green-500"
              : trend === "negative"
              ? "text-red-500"
              : "text-blue-500"
          }`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
      </CardContent>
    </Card>
  );
}

function PaymentMethodCard({
  method,
  amount,
  icon,
}: {
  method: string;
  amount: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-700 p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-sm">{method}</span>
      </div>
      <div className="text-xl font-semibold text-white">
        {formatCurrency(amount)}
      </div>
    </div>
  );
}
