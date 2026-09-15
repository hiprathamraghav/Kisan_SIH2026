import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function OperatorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) redirect("/auth/admin/login");
  if (session.user.role !== "ADMIN") redirect("/farmer");
  return children;
}
