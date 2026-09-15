"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerKisan } from "@/actions/auth-actions";
import { useServerAction } from "@/hooks/use-server-action";
import { kisanSignupSchema, type KisanSignupInput } from "@/lib/validation";

const states = ["Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh", "Rajasthan", "Bihar", "Maharashtra", "Other"];

export function KisanSignupForm() {
  const form = useForm<KisanSignupInput>({ resolver: zodResolver(kisanSignupSchema), defaultValues: { name: "", phoneNumber: "", state: "", district: "", password: "" } });
  const { execute, isPending, result } = useServerAction(registerKisan);
  const onSubmit = form.handleSubmit(async (values) => {
    const response = await execute(values);
    if (!response.success && response.fieldErrors) Object.entries(response.fieldErrors).forEach(([field, messages]) => form.setError(field as keyof KisanSignupInput, { message: messages?.[0] }));
  });

  if (result?.success) return <section className="rounded-3xl bg-white p-7 shadow-xl"><h1 className="text-2xl font-black text-green-950">Registration complete</h1><p className="mt-3 text-green-900/70">Keep this Kisan ID safe. You can use it or your phone number to log in.</p><p className="mt-5 rounded-2xl bg-green-50 p-4 text-xl font-black text-green-800">{result.data.kisanId}</p><Link className="mt-6 inline-block rounded-2xl bg-green-700 px-5 py-3 font-bold text-white" href="/auth/kisan/login">Continue to login</Link></section>;
  return <form onSubmit={onSubmit} className="space-y-4 rounded-3xl bg-white p-7 shadow-xl" noValidate><div><h1 className="text-2xl font-black text-green-950">Kisan registration</h1><p className="mt-1 text-sm text-green-900/70">Create your procurement portal account.</p></div><Field label="Full name" error={form.formState.errors.name?.message}><input {...form.register("name")} autoComplete="name" /></Field><Field label="Mobile number" error={form.formState.errors.phoneNumber?.message}><input {...form.register("phoneNumber")} inputMode="numeric" maxLength={10} autoComplete="tel" /></Field><Field label="State" error={form.formState.errors.state?.message}><select {...form.register("state")}><option value="">Select state</option>{states.map((state) => <option key={state}>{state}</option>)}</select></Field><Field label="District" error={form.formState.errors.district?.message}><input {...form.register("district")} /></Field><Field label="Password" error={form.formState.errors.password?.message}><input {...form.register("password")} type="password" autoComplete="new-password" /></Field>{result && !result.success && <p className="text-sm font-semibold text-red-700">{result.error}</p>}<button disabled={isPending} className="w-full rounded-2xl bg-green-700 px-5 py-3 font-black text-white disabled:opacity-60">{isPending ? "Creating account…" : "Create account"}</button><p className="text-center text-sm">Already registered? <Link className="font-bold text-green-700" href="/auth/kisan/login">Log in</Link></p></form>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="grid gap-1 text-sm font-bold text-green-950"><span>{label}</span><span className="[&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-green-900/20 [&_input]:px-3 [&_input]:py-2.5 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:border-green-900/20 [&_select]:px-3 [&_select]:py-2.5">{children}</span>{error && <span className="text-xs text-red-700">{error}</span>}</label>; }
