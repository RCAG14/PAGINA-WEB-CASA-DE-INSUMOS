import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { RegisterForm } from "@/components/site/register-form";

export const dynamic = "force-dynamic";

export default async function RegistroPage() {
  const session = await getSession();
  if (session) redirect("/");

  return <RegisterForm />;
}
