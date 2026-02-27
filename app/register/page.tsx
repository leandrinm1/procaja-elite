"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password || !nombre || !nombreNegocio) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Crear negocio
      const negocioRef = doc(db, "negocios", `negocio_${userId}`);
      await setDoc(negocioRef, {
        nombre: nombreNegocio,
        ownerId: userId,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Crear sucursal principal
      const sucursalRef = doc(
        db,
        "sucursales",
        `sucursal_principal_${userId}`
      );
      await setDoc(sucursalRef, {
        negocioId: negocioRef.id,
        nombre: "Sucursal Principal",
        activa: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Crear usuario en Firestore
      await setDoc(doc(db, "usuarios", userId), {
        email,
        nombre,
        role: "admin",
        negocioId: negocioRef.id,
        sucursalId: sucursalRef.id,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success("¡Cuenta creada exitosamente!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);

      let message = "Error al crear la cuenta";
      if (error.code === "auth/email-already-in-use") {
        message = "Este correo ya está registrado";
      } else if (error.code === "auth/invalid-email") {
        message = "Correo electrónico inválido";
      } else if (error.code === "auth/weak-password") {
        message = "La contraseña es muy débil";
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-700">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
            <Building2 className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>
              Comienza a gestionar tu negocio hoy
            </CardDescription>
          </div>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Tu Nombre</Label>
              <Input
                id="nombre"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombreNegocio">Nombre del Negocio</Label>
              <Input
                id="nombreNegocio"
                placeholder="Mi Empresa S.A."
                value={nombreNegocio}
                onChange={(e) => setNombreNegocio(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 6 caracteres
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Cuenta
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
