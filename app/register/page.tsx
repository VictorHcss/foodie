"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/auth-shell";
import { FieldError, PasswordInput } from "@/components/auth/password-input";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

type Errors = Partial<
  Record<"name" | "email" | "password" | "confirm", string>
>;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const validate = (): Errors => {
    const e: Errors = {};
    if (name.trim().split(" ").filter(Boolean).length < 1)
      e.name = "Diga como podemos te chamar.";
    if (!/^\S+@\S+\.\S+$/.test(email))
      e.email = "Esse e-mail parece incompleto.";
    if (password.length < 6) e.password = "Use pelo menos 6 caracteres.";
    if (confirm !== password) e.confirm = "As senhas estão diferentes.";
    return e;
  };

  const strength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : /\d/.test(password) &&
            /[A-Za-z]/.test(password) &&
            password.length >= 8
          ? 3
          : 2;

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    const ok = await register(name, email, password);
    setLoading(false);
    if (!ok) {
      setErrors({
        email: "Já existe uma conta com esse e-mail. Que tal entrar?",
      });
      return;
    }
    toast.success(`Conta criada. Bem-vindo, ${name.split(" ")[0]}!`);
    router.push("/");
  };

  const field = (k: keyof Errors) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-error` : undefined,
  });

  return (
    <AuthShell
      headline={
        <>
          Bateu a fome?
          <br />
          Vem de Foodie.
        </>
      }
    >
      <h1 className="font-display text-5xl font-extrabold">Criar conta</h1>
      <p className="mt-2 text-muted-foreground">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Entrar
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div>
          <Label htmlFor="name" className="mb-1.5">
            Nome
          </Label>
          <Input
            id="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-xl"
            {...field("name")}
          />
          <FieldError id="name-error">{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="email" className="mb-1.5">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl"
            {...field("email")}
          />
          <FieldError id="email-error">{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="password" className="mb-1.5">
            Senha
          </Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl"
            {...field("password")}
          />
          <div className="mt-2 flex gap-1" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={cn(
                  "h-1 flex-1 rounded-full bg-border transition-colors",
                  strength >= n &&
                    (strength === 1
                      ? "bg-destructive"
                      : strength === 2
                        ? "bg-brand"
                        : "bg-success"),
                )}
              />
            ))}
          </div>
          <FieldError id="password-error">{errors.password}</FieldError>
          {!errors.password && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Pelo menos 6 caracteres. Misture letras e números para ficar mais
              forte.
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="confirm" className="mb-1.5">
            Repita a senha
          </Label>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="h-12 rounded-xl"
            {...field("confirm")}
          />
          <FieldError id="confirm-error">{errors.confirm}</FieldError>
        </div>
        <Button
          type="submit"
          className="h-12 w-full rounded-full text-base font-bold"
          disabled={loading}
        >
          {loading ? "Criando conta…" : "Criar conta"}
        </Button>
      </form>
    </AuthShell>
  );
}
