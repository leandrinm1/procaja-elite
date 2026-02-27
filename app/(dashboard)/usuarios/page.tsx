"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Usuarios</h1>
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Funcionalidad en desarrollo. Aquí podrás gestionar usuarios y asignar roles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
