"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { ArrowLeftRight } from "lucide-react";
import { actualizarTipoCambioAction } from "@/app/admin/desarrollo-web/actions";
import { Panel, PanelHeader } from "@/components/admin/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, getErrorMessage } from "@/lib/toast";

/**
 * Bolivianos por dólar con que /desarrollo-web muestra sus precios cuando el
 * visitante elige "Bs". Los precios se siguen cargando en dólares.
 */
export function TipoCambioForm({ tipoCambio }: { tipoCambio: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [valor, setValor] = useState(String(tipoCambio));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const numero = Number(valor.replace(",", "."));
    if (!Number.isFinite(numero) || numero <= 0) {
      toast.error("El tipo de cambio debe ser un número mayor a 0.");
      return;
    }
    startTransition(async () => {
      try {
        await actualizarTipoCambioAction(numero);
        router.refresh();
        toast.success("Tipo de cambio actualizado.");
      } catch (err) {
        toast.error({
          title: "No se pudo actualizar el tipo de cambio",
          description: getErrorMessage(err, "Intenta nuevamente en unos segundos."),
        });
      }
    });
  }

  return (
    <Panel className="max-w-xl">
      <PanelHeader
        label="Tipo de cambio"
        icon={<ArrowLeftRight className="size-4 text-muted-foreground" />}
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
        <p className="text-xs text-muted-foreground">
          Los paquetes y extras se cargan en dólares (US$). En el sitio, el visitante puede
          verlos en bolivianos con este tipo de cambio, como monto referencial.
        </p>
        <div className="flex items-end gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="tc-valor" className="text-xs">
              Bolivianos por 1 US$
            </Label>
            <Input
              id="tc-valor"
              type="number"
              min={0.0001}
              step="0.0001"
              required
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Panel>
  );
}
