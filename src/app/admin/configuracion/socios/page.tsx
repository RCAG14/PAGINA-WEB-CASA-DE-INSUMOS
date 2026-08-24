import { redirect } from "next/navigation";

export default function AdminSociosPageRedirect() {
  redirect("/admin/configuracion/usuarios");
}
