"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reportes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Generación de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidad en desarrollo. Aquí podrás generar reportes de ventas, gastos y cierres.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
