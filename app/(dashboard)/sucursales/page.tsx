"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SucursalesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sucursales</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Sucursales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidad en desarrollo. Aquí podrás crear y gestionar sucursales de cada negocio.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
