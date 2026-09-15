import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function FarmerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) redirect("/auth/kisan/login");
  if (session.user.role !== "KISAN") redirect("/operator");
  return children;
}
