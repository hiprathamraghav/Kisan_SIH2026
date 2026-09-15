"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, kisanLoginSchema, type AdminLoginInput, type KisanLoginInput } from "@/lib/validation";

type Props = { role: "kisan" | "admin" };
export function LoginForm({ role }: Props) {
  const schema = role === "kisan" ? kisanLoginSchema : adminLoginSchema;
  const form = useForm<KisanLoginInput | AdminLoginInput>({ resolver: zodResolver(schema), defaultValues: { identifier: "", password: "" } });
  const onSubmit = form.handleSubmit(async ({ identifier, password }) => {
    const response = await signIn(role === "kisan" ? "kisan-credentials" : "admin-credentials", { identifier, password, redirect: false });
    if (response?.error) form.setError("root", { message: "Invalid credentials. Please try again." });
    else window.location.assign(role === "kisan" ? "/farmer" : "/operator");
  });
  const identifierLabel = role === "kisan" ? "Phone number or Kisan ID" : "Phone number or Admin ID";
  return <form onSubmit={onSubmit} className="space-y-4 rounded-3xl bg-white p-7 shadow-xl" noValidate><div><h1 className="text-2xl font-black text-green-950">{role === "kisan" ? "Kisan login" : "Admin login"}</h1><p className="mt-1 text-sm text-green-900/70">Sign in to the Kisan Procurement Portal.</p></div><label className="grid gap-1 text-sm font-bold text-green-950">{identifierLabel}<input className="rounded-xl border border-green-900/20 px-3 py-2.5" {...form.register("identifier")} autoComplete="username" />{form.formState.errors.identifier && <span className="text-xs text-red-700">{form.formState.errors.identifier.message}</span>}</label><label className="grid gap-1 text-sm font-bold text-green-950">Password<input className="rounded-xl border border-green-900/20 px-3 py-2.5" type="password" {...form.register("password")} autoComplete="current-password" />{form.formState.errors.password && <span className="text-xs text-red-700">{form.formState.errors.password.message}</span>}</label>{form.formState.errors.root && <p className="text-sm font-semibold text-red-700">{form.formState.errors.root.message}</p>}<button disabled={form.formState.isSubmitting} className="w-full rounded-2xl bg-green-700 px-5 py-3 font-black text-white disabled:opacity-60">{form.formState.isSubmitting ? "Signing in…" : "Log in"}</button>{role === "kisan" ? <p className="text-center text-sm">New here? <Link className="font-bold text-green-700" href="/auth/kisan/signup">Register as a Kisan</Link></p> : <p className="text-center text-sm"><Link className="font-bold text-green-700" href="/auth/kisan/login">Kisan login</Link></p>}</form>;
}
