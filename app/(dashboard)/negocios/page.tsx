"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NegociosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Negocios</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Negocios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidad en desarrollo. Aquí podrás crear y gestionar múltiples negocios.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
