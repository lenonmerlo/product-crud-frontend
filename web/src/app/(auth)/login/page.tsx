"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import api from "@/lib/api";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import type { AuthResponse } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    try {
      setError(null);

      const response = await api.post<AuthResponse>("/auth/login", data);

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      router.replace("/products");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message;

        if (typeof message === "string") {
          setError(message);
          return;
        }
      }

      setError("E-mail ou senha inválidos");
    }
  }

  return (
    <section className="glass-card rounded-2xl p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-brand/75">Acesso</p>
      <h2 className="mb-1 mt-2 text-2xl font-semibold text-foreground [font-family:var(--font-geist-display)]">
        Entrar na conta
      </h2>
      <p className="mb-6 text-sm text-muted">
        Use suas credenciais de trabalho.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-foreground/85"
          >
            E-mail
          </label>
          <input
            id="email"
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            className="input-premium w-full rounded-xl px-3 py-2.5 text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-foreground/85"
          >
            Senha
          </label>
          <input
            id="password"
            {...register("password")}
            type="password"
            autoComplete="current-password"
            placeholder="Sua senha"
            className="input-premium w-full rounded-xl px-3 py-2.5 text-sm"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-error">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-xl border border-error/30 bg-error/10 p-3">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-brand w-full rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Não tem conta?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand hover:text-brand-strong"
        >
          Criar conta
        </Link>
      </p>
    </section>
  );
}
