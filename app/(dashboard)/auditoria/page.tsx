"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditoriaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Auditoría</h1>
      <Card>
        <CardHeader>
          <CardTitle>Log de Auditoría</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidad en desarrollo. Aquí podrás ver el historial completo de acciones en el sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
