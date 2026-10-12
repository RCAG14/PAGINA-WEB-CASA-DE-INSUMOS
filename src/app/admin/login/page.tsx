import { LoginForm } from "@/components/admin/login-form";
import { getLogo } from "@/lib/data/landing";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const searchParams = await props.searchParams;
  const next = typeof searchParams.next === "string" ? searchParams.next : undefined;
  const logo = await getLogo();

  return <LoginForm next={next} logoUrl={logo?.url ?? null} />;
}
